import { agentIcon, cardArt, tierIcon } from "@/lib/card/assets";
import { toAccentColor } from "@/lib/card/color";
import { DEFAULT_CARD_CONFIG, type CardConfig, type CardLayout } from "@/lib/card/config";
import type { Catalog } from "@/types/catalog";

/** Kartı çizmek için gereken, katalogdan çözülmüş tüm veriler. */
export interface CardData {
  layout: CardLayout;
  name: string;
  tag: string;
  level: number;
  levelBadge: string | null;
  title: string;
  agentName: string;
  agentIcon: string;
  accentColor: string;
  cardLargeArt: string;
  cardWideArt: string;
  tierName: string;
  tierIcon: string;
  fade: boolean;
}

const findOr = <T>(items: T[], match: (item: T) => boolean, fallback: (item: T) => boolean) =>
  items.find(match) ?? items.find(fallback) ?? items[0];

export const resolveCardData = (
  config: CardConfig,
  catalog: Catalog
): CardData => {
  // Linkteki id'ler artık katalogda yoksa varsayılan karta düşülür.
  const card = findOr(
    catalog.cards,
    (c) => c.id === config.cardId,
    (c) => c.id === DEFAULT_CARD_CONFIG.cardId
  );
  const agent = findOr(
    catalog.agents,
    (a) => a.id === config.agentId,
    (a) => a.id === DEFAULT_CARD_CONFIG.agentId
  );
  const title = findOr(
    catalog.titles,
    (t) => t.id === config.titleId,
    (t) => t.id === DEFAULT_CARD_CONFIG.titleId
  );
  const tier = findOr(
    catalog.tiers,
    (t) => t.tier === config.tier,
    (t) => t.tier === DEFAULT_CARD_CONFIG.tier
  );
  const levelBorder = catalog.levelBorders.findLast(
    (border) => border.startingLevel <= config.level
  );

  const cardId = card?.id ?? DEFAULT_CARD_CONFIG.cardId;
  const tierNumber = tier?.tier ?? DEFAULT_CARD_CONFIG.tier;

  return {
    layout: config.layout,
    name: config.name,
    tag: config.tag,
    level: config.level,
    levelBadge: levelBorder?.badge ?? null,
    title: title?.text ?? "",
    agentName: agent?.name ?? "",
    agentIcon: agentIcon(agent?.id ?? DEFAULT_CARD_CONFIG.agentId),
    accentColor: toAccentColor(agent?.colors[0] ?? "#57ddc5"),
    cardLargeArt: cardArt(cardId, "largeart"),
    cardWideArt: cardArt(cardId, "wideart"),
    tierName: tier?.name ?? "",
    tierIcon: tierIcon(catalog.tierSetId, tierNumber),
    fade: config.fade,
  };
};
