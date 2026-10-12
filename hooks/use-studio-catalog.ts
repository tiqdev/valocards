import { useCatalog } from "@/queries/catalog";
import { useCardStore } from "@/stores/card-store";
import type { Catalog } from "@/types/catalog";

/** Seçili dildeki katalog; `select` ile sadece gereken parça alınır. */
export const useStudioCatalog = <T = Catalog>(select?: (catalog: Catalog) => T) =>
  useCatalog(
    useCardStore((state) => state.config.lang),
    select
  );
