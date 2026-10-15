"use client";

import { AssetGrid } from "@/components/pickers/asset-grid";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { useTranslations } from "@/hooks/use-translations";
import { cardArt } from "@/lib/card/assets";
import { useCardStore } from "@/stores/card-store";
import type { Catalog, CatalogCard } from "@/types/catalog";

const selectCards = (catalog: Catalog) => catalog.cards;
const cardThumbnail = (card: CatalogCard) => cardArt(card.id, "smallart");

export const CardPicker = () => {
  const cardId = useCardStore((state) => state.config.cardId);
  const update = useCardStore((state) => state.update);
  const { data: cards = [] } = useStudioCatalog(selectCards);
  const t = useTranslations();

  return (
    <AssetGrid
      items={cards}
      getImage={cardThumbnail}
      selectedId={cardId}
      onSelect={(card) => update({ cardId: card.id })}
      searchPlaceholder={t.search_cards}
    />
  );
};
