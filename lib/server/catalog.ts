import "server-only";

import { cache } from "react";
import type { LanguageCode } from "@/lib/i18n";
import type { Catalog } from "@/types/catalog";
import type {
  Agent,
  CompetitiveTierSet,
  LevelBorder,
  PlayerCard,
  PlayerTitle,
  ValorantApiResponse,
} from "@/types/valorant";

const API_URL = "https://valorant-api.com/v1";

// Oyun verisi yamalarla değişir; günde bir tazelemek yeterli.
const REVALIDATE_SECONDS = 60 * 60 * 24;

const HIDDEN_TITLES = new Set([
  "VCT MASTERS REYKJAVIK GALİBİ",
  "VCT Masters Reykjavik Winner",
]);

const request = async <T>(
  path: string,
  params: Record<string, string>
): Promise<T> => {
  const url = `${API_URL}${path}?${new URLSearchParams(params)}`;
  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`valorant-api ${path} failed: ${response.status}`);
  }

  const body = (await response.json()) as ValorantApiResponse<T>;
  return body.data;
};

const rgbaToHex = (rgba: string) => `#${rgba.slice(0, 6)}`;

export const getCatalog = cache(
  async (language: LanguageCode): Promise<Catalog> => {
    const [cards, titles, agents, tierSets, levelBorders] = await Promise.all([
      request<PlayerCard[]>("/playercards", { language }),
      request<PlayerTitle[]>("/playertitles", { language }),
      request<Agent[]>("/agents", { language, isPlayableCharacter: "true" }),
      request<CompetitiveTierSet[]>("/competitivetiers", { language }),
      request<LevelBorder[]>("/levelborders", { language }),
    ]);

    // Son sezonun rank seti (Ascendant dahil).
    const tierSet = tierSets.at(-1);

    return {
      language,
      tierSetId: tierSet?.uuid ?? "",
      cards: cards
        .filter((card) => card.largeArt && card.wideArt && card.smallArt)
        .map((card) => ({ id: card.uuid, name: card.displayName })),
      titles: titles
        .filter(
          (title): title is PlayerTitle & { titleText: string } =>
            !!title.titleText && !HIDDEN_TITLES.has(title.titleText)
        )
        .map((title) => ({ id: title.uuid, text: title.titleText }))
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
