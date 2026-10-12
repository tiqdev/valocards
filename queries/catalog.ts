import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCatalog } from "@/lib/api/client";
import type { LanguageCode } from "@/lib/i18n";
import type { Catalog } from "@/types/catalog";

export const catalogQueryKey = (lang: LanguageCode) =>
  ["catalog", lang] as const;

export const catalogQuery = (lang: LanguageCode) =>
  queryOptions({
    queryKey: catalogQueryKey(lang),
    queryFn: () => fetchCatalog(lang),
    // Oyun verisi nadiren değişir.
    staleTime: 60 * 60 * 1000,
  });

export const useCatalog = <T = Catalog>(
  lang: LanguageCode,
  select?: (catalog: Catalog) => T
) =>
  useQuery({
    ...catalogQuery(lang),
    select,
    // Dil değişirken yeni veri gelene kadar önceki dili göster.
    placeholderData: (previous) => previous,
  });
