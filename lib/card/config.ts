import { defaultLanguage, isLanguageCode, type LanguageCode } from "@/lib/i18n";
import type { Catalog } from "@/types/catalog";

export const LAYOUTS = ["vertical", "horizontal"] as const;
export type CardLayout = (typeof LAYOUTS)[number];

export const NAME_MAX_LENGTH = 16;
export const TAG_MAX_LENGTH = 5;
export const LEVEL_MIN = 1;
export const LEVEL_MAX = 999;

/** Kartın tamamı bu yapıyla tanımlanır ve URL'de bu haliyle saklanır. */
export interface CardConfig {
  lang: LanguageCode;
  layout: CardLayout;
  name: string;
  tag: string;
  level: number;
  cardId: string;
  agentId: string;
  titleId: string;
  tier: number;
  fade: boolean;
}

export const DEFAULT_CARD_CONFIG: CardConfig = {
  lang: defaultLanguage,
  layout: "vertical",
  name: "Zena",
  tag: "",
  level: 120,
  cardId: "504f38e4-4874-845c-ccb6-a3aec7a3a1eb", // Omen kartı
  agentId: "8e253930-4c05-31dd-1b6c-968525494517", // Omen
  titleId: "c402b173-403b-b3f6-f1a6-2a819a687397", // YR1
  tier: 26, // Immortal 3
  fade: true,
};

// URL'deki parametre adları
const PARAM = {
  lang: "lang",
  layout: "layout",
  name: "name",
  tag: "tag",
  level: "lvl",
  cardId: "card",
  agentId: "agent",
  titleId: "title",
  tier: "rank",
  fade: "fade",
} as const satisfies Record<keyof CardConfig, string>;

type SearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const sanitizeName = (value: string) =>
  value.slice(0, NAME_MAX_LENGTH);

export const sanitizeTag = (value: string) =>
  value.replace(/[^\p{L}\p{N}]/gu, "").slice(0, TAG_MAX_LENGTH);

export const sanitizeLevel = (value: number) =>
  Number.isFinite(value)
    ? clamp(Math.round(value), LEVEL_MIN, LEVEL_MAX)
    : DEFAULT_CARD_CONFIG.level;

const readParam = (params: SearchParamsInput, key: string) => {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

export const parseCardConfig = (
  params: SearchParamsInput,
  fallbackLang: LanguageCode = defaultLanguage
): CardConfig => {
  const get = (key: keyof CardConfig) => readParam(params, PARAM[key]);
  const uuid = (key: "cardId" | "agentId" | "titleId") => {
    const value = get(key);
    return value && UUID_PATTERN.test(value)
      ? value.toLowerCase()
      : DEFAULT_CARD_CONFIG[key];
  };

  const lang = get("lang");
  const layout = get("layout");
  const name = get("name");
  const level = Number(get("level"));
  const tier = Number(get("tier"));

  return {
    lang: lang && isLanguageCode(lang) ? lang : fallbackLang,
    layout: layout === "horizontal" ? "horizontal" : "vertical",
    name: name !== undefined ? sanitizeName(name) : DEFAULT_CARD_CONFIG.name,
    tag: sanitizeTag(get("tag") ?? ""),
    level: get("level") ? sanitizeLevel(level) : DEFAULT_CARD_CONFIG.level,
    cardId: uuid("cardId"),
    agentId: uuid("agentId"),
    titleId: uuid("titleId"),
    tier: Number.isInteger(tier) && tier >= 0 ? tier : DEFAULT_CARD_CONFIG.tier,
    fade: get("fade") !== "0",
  };
};

export const serializeCardConfig = (config: CardConfig) => {
  const params = new URLSearchParams();

  params.set(PARAM.lang, config.lang);
  params.set(PARAM.layout, config.layout);
  params.set(PARAM.name, config.name);
  if (config.tag) params.set(PARAM.tag, config.tag);
  params.set(PARAM.level, String(config.level));
  params.set(PARAM.cardId, config.cardId);
  params.set(PARAM.agentId, config.agentId);
  params.set(PARAM.titleId, config.titleId);
  params.set(PARAM.tier, String(config.tier));
  if (!config.fade) params.set(PARAM.fade, "0");

  return params;
};

const pick = <T>(items: T[]): T | undefined =>
  items[Math.floor(Math.random() * items.length)];

export const randomizeCardConfig = (
  config: CardConfig,
  catalog: Catalog
): CardConfig => ({
  ...config,
  cardId: pick(catalog.cards)?.id ?? config.cardId,
  agentId: pick(catalog.agents)?.id ?? config.agentId,
  titleId: pick(catalog.titles)?.id ?? config.titleId,
  tier: pick(catalog.tiers.filter((t) => t.tier > 0))?.tier ?? config.tier,
  level: sanitizeLevel(Math.random() * 500),
});

/** PNG'yi üreten route'un adresi (indirme ve og:image için). */
export const cardImagePath = (config: CardConfig) =>
  `/api/card?${serializeCardConfig(config)}`;
