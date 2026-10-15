import type { LanguageCode } from "@/lib/i18n";
import type { ContentSource } from "@/types/catalog";

export interface WallpaperSpray {
  id: string;
  name: string;
  /** Koleksiyonda sadece sahiplerine görünen içerik. */
  rare: boolean;
  source: ContentSource | null;
}

export interface WallpaperMap {
  id: string;
  name: string;
  /** 1920×1080 tam ekran görseli (arka plan). */
  splash: string;
  /** Listede gösterilen yatay şerit görseli. */
  thumbnail: string;
  /** Rekabetçi harita havuzunda mı. */
  competitive: boolean;
}

/** Duvar kağıdı stüdyosuna özel varlıklar (ajan ve kartlar katalogdan gelir). */
export interface WallpaperAssets {
  language: LanguageCode;
  /** Oyun sürümü, örn. "13.06.00.5590001" */
  version: string;
  sprays: WallpaperSpray[];
  maps: WallpaperMap[];
}
