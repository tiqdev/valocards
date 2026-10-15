import "server-only";

import { cache } from "react";
import type { LanguageCode } from "@/lib/i18n";
import type { ContentSource, ContentSourceType } from "@/types/catalog";
import type {
  Contract,
  GameVersion,
  ValorantApiResponse,
} from "@/types/valorant";

const API_URL = "https://valorant-api.com/v1";

// Sürüm sık kontrol edilir; içerik ise sürüm değişene kadar önbellekte kalır.
const VERSION_REVALIDATE_SECONDS = 60 * 60;
const CONTENT_REVALIDATE_SECONDS = 60 * 60 * 24 * 7;

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
export const getGameVersion = cache(async () => {
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
 * Oyun içeriği isteği. Sürüm adrese eklenir: yeni yamada önbellek anahtarı
 * değişir ve veri hemen yenilenir. valorant-api bilinmeyen parametreyi yok sayar.
 */
export const requestContent = async <T>(
  path: string,
  language: LanguageCode,
  params: Record<string, string> = {}
) =>
  request<T>(
    path,
    { language, ...params, v: await getGameVersion() },
    CONTENT_REVALIDATE_SECONDS
  );

const SOURCE_TYPES: Record<string, ContentSourceType> = {
  Season: "battlepass",
  Agent: "agent",
  Event: "event",
};

const SOURCED_REWARD_TYPES = new Set(["PlayerCard", "Title", "Spray"]);

/**
 * Kart, ünvan ve spreylerin hangi kontrattan (battle pass, ajan, etkinlik)
 * kazanıldığı. Anahtar: içerik uuid'si.
 */
export const getContentSources = cache(async (language: LanguageCode) => {
  const contracts = await requestContent<Contract[]>("/contracts", language);
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
          SOURCED_REWARD_TYPES.has(reward.type) &&
          !sources.has(reward.uuid)
        ) {
          sources.set(reward.uuid, { type, name: contract.displayName });
        }
      }
    }
  }

  return sources;
});
