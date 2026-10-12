import "server-only";

import { cache } from "react";
import type { LanguageCode } from "@/lib/i18n";
import type { Catalog, ContentSource, ContentSourceType } from "@/types/catalog";
import type {
  Agent,
  CompetitiveTierSet,
  Contract,
  GameVersion,
  LevelBorder,
  PlayerCard,
  PlayerTitle,
  ValorantApiResponse,
} from "@/types/valorant";

const API_URL = "https://valorant-api.com/v1";

// Sürüm sık kontrol edilir; içerik ise sürüm değişene kadar önbellekte kalır.
const VERSION_REVALIDATE_SECONDS = 60 * 60;
const CONTENT_REVALIDATE_SECONDS = 60 * 60 * 24 * 7;

const HIDDEN_TITLES = new Set([
  "VCT MASTERS REYKJAVIK GALİBİ",
  "VCT Masters Reykjavik Winner",
]);

const SOURCE_TYPES: Record<string, ContentSourceType> = {
  Season: "battlepass",
  Agent: "agent",
  Event: "event",
};

const request = async <T>(
  path: string,
  params: Record<string, string>,
  revalidate: number
): Promise<T> => {
  const url = `${API_URL}${path}?${new URLSearchParams(params)}`;
  const response = await fetch(url, { next: { revalidate } });

  if (!response.ok) {
    throw new Error(`valorant-api ${path} failed: ${response.status}`);
  }

  const body = (await response.json()) as ValorantApiResponse<T>;
  return body.data;
};

/** Oyun sürümü; yeni yama geldiğinde değişir. */
const getGameVersion = cache(async () => {
  try {
    const data = await request<GameVersion>(
      "/version",
      {},
      VERSION_REVALIDATE_SECONDS
    );
    return data.version;
  } catch {
    return "unknown";
  }
});

/**
 * Kart ve ünvanların hangi kontrattan (battle pass, ajan, etkinlik)
 * kazanıldığını çıkarır. Anahtar: içerik uuid'si.
 */
const buildSourceMap = (contracts: Contract[]) => {
  const sources = new Map<string, ContentSource>();

  for (const contract of contracts) {
    const type = SOURCE_TYPES[contract.content?.relationType ?? ""];
    if (!type) continue;

    for (const chapter of contract.content?.chapters ?? []) {
      const rewards = [
        ...(chapter.levels ?? []).map((level) => level.reward),
        ...(chapter.freeRewards ?? []),
      ];

      for (const reward of rewards) {
        if (
          reward &&
          (reward.type === "PlayerCard" || reward.type === "Title") &&
          !sources.has(reward.uuid)
        ) {
          sources.set(reward.uuid, { type, name: contract.displayName });
        }
      }
    }
  }

  return sources;
};

const rgbaToHex = (rgba: string) => `#${rgba.slice(0, 6)}`;

export const getCatalog = cache(
  async (language: LanguageCode): Promise<Catalog> => {
    const version = await getGameVersion();
    // Sürüm adrese eklenir: yeni yamada önbellek anahtarı değişir ve
    // veri hemen yenilenir. valorant-api bilinmeyen parametreyi yok sayar.
    const get = <T>(path: string, params: Record<string, string> = {}) =>
      request<T>(
        path,
        { language, ...params, v: version },
        CONTENT_REVALIDATE_SECONDS
      );

    const [cards, titles, agents, tierSets, levelBorders, contracts] =
      await Promise.all([
        get<PlayerCard[]>("/playercards"),
        get<PlayerTitle[]>("/playertitles"),
        get<Agent[]>("/agents", { isPlayableCharacter: "true" }),
        get<CompetitiveTierSet[]>("/competitivetiers"),
        get<LevelBorder[]>("/levelborders"),
        get<Contract[]>("/contracts"),
      ]);

    const sources = buildSourceMap(contracts);
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
