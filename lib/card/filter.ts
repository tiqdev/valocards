import {
  CONTENT_SOURCES,
  type ContentSource,
} from "@/types/catalog";

export const CONTENT_FILTERS = ["all", ...CONTENT_SOURCES, "rare"] as const;
export type ContentFilter = (typeof CONTENT_FILTERS)[number];

interface FilterableContent {
  rare: boolean;
  source: ContentSource | null;
}

export const matchesContentFilter = (
  item: FilterableContent,
  filter: ContentFilter
) => {
  if (filter === "all") return true;
  if (filter === "rare") return item.rare;
  return item.source?.type === filter;
};

export const countByContentFilter = (items: FilterableContent[]) =>
  Object.fromEntries(
    CONTENT_FILTERS.map((filter) => [
      filter,
      items.filter((item) => matchesContentFilter(item, filter)).length,
    ])
  ) as Record<ContentFilter, number>;
