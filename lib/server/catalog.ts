import "server-only";

import { cache } from "react";
import type { LanguageCode } from "@/lib/i18n";
import {
  getContentSources,
  getGameVersion,
  requestContent,
} from "@/lib/server/valorant-api";
import type { Catalog } from "@/types/catalog";
import type {
  Agent,
  CompetitiveTierSet,
  LevelBorder,
  PlayerCard,
  PlayerTitle,
} from "@/types/valorant";

const HIDDEN_TITLES = new Set([
  "VCT MASTERS REYKJAVIK GALİBİ",
  "VCT Masters Reykjavik Winner",
]);

const rgbaToHex = (rgba: string) => `#${rgba.slice(0, 6)}`;

export const getCatalog = cache(
  async (language: LanguageCode): Promise<Catalog> => {
    const [version, cards, titles, agents, tierSets, levelBorders, sources] =
      await Promise.all([
        getGameVersion(),
        requestContent<PlayerCard[]>("/playercards", language),
        requestContent<PlayerTitle[]>("/playertitles", language),
        requestContent<Agent[]>("/agents", language, {
          isPlayableCharacter: "true",
        }),
        requestContent<CompetitiveTierSet[]>("/competitivetiers", language),
        requestContent<LevelBorder[]>("/levelborders", language),
        getContentSources(language),
      ]);

    // Son sezonun rank seti (Ascendant dahil).
    const tierSet = tierSets.at(-1);

    return {
      language,
      version,
      tierSetId: tierSet?.uuid ?? "",
      cards: cards
        .filter((card) => card.largeArt && card.wideArt && card.smallArt)
        .map((card) => ({
          id: card.uuid,
          name: card.displayName,
          rare: card.isHiddenIfNotOwned,
          source: sources.get(card.uuid) ?? null,
        })),
      titles: titles
        .filter(
          (title): title is PlayerTitle & { titleText: string } =>
            !!title.titleText && !HIDDEN_TITLES.has(title.titleText)
        )
        .map((title) => ({
          id: title.uuid,
          text: title.titleText,
          rare: title.isHiddenIfNotOwned,
          source: sources.get(title.uuid) ?? null,
        }))
        .sort((a, b) => a.text.localeCompare(b.text, language)),
      agents: agents
        .map((agent) => ({
          id: agent.uuid,
          name: agent.displayName,
          colors: (agent.backgroundGradientColors ?? []).map(rgbaToHex),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, language)),
      tiers: (tierSet?.tiers ?? [])
        .filter((tier) => tier.largeIcon !== null)
        .map((tier) => ({
          tier: tier.tier,
          name: tier.tierName,
          division: tier.divisionName,
          color: rgbaToHex(tier.color ?? "ffffffff"),
        })),
      levelBorders: levelBorders
        .map((border) => ({
          id: border.uuid,
          startingLevel: border.startingLevel,
          badge: border.levelNumberAppearance,
        }))
        .sort((a, b) => a.startingLevel - b.startingLevel),
    };
  }
);
