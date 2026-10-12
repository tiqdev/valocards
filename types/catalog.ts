import type { LanguageCode } from "@/lib/i18n";

// valorant-api.com yanıtlarının uygulamada kullanılan, sadeleştirilmiş hali.
// Görsel URL'leri id'den türetilir (bkz. lib/card/assets.ts).

export interface CatalogCard {
  id: string;
  name: string;
}

export interface CatalogTitle {
  id: string;
  text: string;
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
}

export interface CatalogLevelBorder {
  id: string;
  startingLevel: number;
  badge: string;
}

export interface Catalog {
  language: LanguageCode;
  tierSetId: string;
  cards: CatalogCard[];
  titles: CatalogTitle[];
  agents: CatalogAgent[];
  tiers: CatalogTier[];
  levelBorders: CatalogLevelBorder[];
}
