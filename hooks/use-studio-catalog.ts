import { useLanguage } from "@/components/i18n-provider";
import { useCatalog } from "@/queries/catalog";
import type { Catalog } from "@/types/catalog";

/** Sayfanın dilindeki katalog; `select` ile sadece gereken parça alınır. */
export const useStudioCatalog = <T = Catalog>(select?: (catalog: Catalog) => T) =>
  useCatalog(useLanguage().lang, select);
