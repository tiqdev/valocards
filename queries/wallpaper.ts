import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchWallpaperAssets } from "@/lib/api/client";
import type { LanguageCode } from "@/lib/i18n";
import type { WallpaperAssets } from "@/types/wallpaper";

export const wallpaperAssetsQueryKey = (lang: LanguageCode) =>
  ["wallpaper-assets", lang] as const;

export const wallpaperAssetsQuery = (lang: LanguageCode) =>
  queryOptions({
    queryKey: wallpaperAssetsQueryKey(lang),
    queryFn: () => fetchWallpaperAssets(lang),
    // Oyun verisi nadiren değişir.
    staleTime: 60 * 60 * 1000,
  });

export const useWallpaperAssets = <T = WallpaperAssets>(
  lang: LanguageCode,
  select?: (assets: WallpaperAssets) => T
) =>
  useQuery({
    ...wallpaperAssetsQuery(lang),
    select,
    // Dil değişirken yeni veri gelene kadar önceki dili göster.
    placeholderData: (previous) => previous,
  });
