import type { LanguageCode } from "@/lib/i18n";

// valorant-api.com yanıtlarının uygulamada kullanılan, sadeleştirilmiş hali.
// Görsel URL'leri id'den türetilir (bkz. lib/card/assets.ts).

export const CONTENT_SOURCES = ["battlepass", "agent", "event"] as const;
export type ContentSourceType = (typeof CONTENT_SOURCES)[number];

/** İçeriğin oyunda nereden kazanıldığı (kontrat verisinden çıkarılır). */
export interface ContentSource {
  type: ContentSourceType;
  /** Örn. "Gekko Teçhizatı", "Sezon 2026 // Kısım 05" */
  name: string;
}

export interface CatalogCard {
  id: string;
  name: string;
  /** Koleksiyonda sadece sahiplerine görünen içerik. */
  rare: boolean;
  source: ContentSource | null;
}

export interface CatalogTitle {
  id: string;
  text: string;
  rare: boolean;
  source: ContentSource | null;
}

export interface CatalogAgent {
  id: string;
  name: string;
  /** Hex renkler, örn. "#433178" */
  colors: string[];
}

export interface CatalogTier {
  tier: number;
  name: string;
  division: string;
  /** Rank'in oyundaki rengi, örn. "#bb3d65" */
  color: string;
}

export interface CatalogLevelBorder {
  id: string;
  startingLevel: number;
  badge: string;
}

export interface Catalog {
  language: LanguageCode;
  /** Oyun sürümü, örn. "13.06.00.5590001" */
  version: string;
  tierSetId: string;
  cards: CatalogCard[];
  titles: CatalogTitle[];
  agents: CatalogAgent[];
  tiers: CatalogTier[];
  levelBorders: CatalogLevelBorder[];
}
