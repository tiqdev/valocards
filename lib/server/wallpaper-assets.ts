import "server-only";

import { cache } from "react";
import type { LanguageCode } from "@/lib/i18n";
import {
  getContentSources,
  getGameVersion,
  requestContent,
} from "@/lib/server/valorant-api";
import type { GameMap, Spray } from "@/types/valorant";
import type { WallpaperAssets } from "@/types/wallpaper";

export const getWallpaperAssets = cache(
  async (language: LanguageCode): Promise<WallpaperAssets> => {
    const [version, sprays, maps, sources] = await Promise.all([
      getGameVersion(),
      requestContent<Spray[]>("/sprays", language),
      requestContent<GameMap[]>("/maps", language),
      getContentSources(language),
    ]);

    const seenMaps = new Set<string>();

    return {
      language,
      version,
      sprays: sprays
        .filter((spray) => !spray.isNullSpray && spray.fullTransparentIcon)
        .map((spray) => ({
          id: spray.uuid,
          name: spray.displayName,
          rare: spray.hideIfNotOwned,
          source: sources.get(spray.uuid) ?? null,
        })),
      maps: maps
        .filter((map): map is GameMap & { splash: string } => !!map.splash)
        .map((map) => ({
          id: map.uuid,
          name: map.displayName,
          splash: map.splash,
          thumbnail: map.listViewIcon ?? map.splash,
          competitive: !!map.tacticalDescription,
        }))
        // Aynı isimle birden fazla gelen haritalar (örn. "The Range") tekilleştirilir.
        .filter((map) => !seenMaps.has(map.name) && !!seenMaps.add(map.name))
        // Rekabetçi haritalar önce.
        .sort(
          (a, b) =>
            Number(b.competitive) - Number(a.competitive) ||
            a.name.localeCompare(b.name, language)
        ),
    };
  }
);
