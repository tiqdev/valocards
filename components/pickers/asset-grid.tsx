"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, Search } from "lucide-react";
import { useLanguage } from "@/components/i18n-provider";
import {
  ContentFilter,
  RareBadge,
} from "@/components/pickers/content-filter";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/hooks/use-translations";
import {
  countByContentFilter,
  matchesContentFilter,
  type ContentFilter as ContentFilterValue,
} from "@/lib/card/filter";
import { cn } from "@/lib/utils";
import type { ContentSource } from "@/types/catalog";

const COLUMNS = 4;
const GAP = 8;

export interface GridAsset {
  id: string;
  name: string;
  rare: boolean;
  source: ContentSource | null;
}

interface AssetGridProps<T extends GridAsset> {
  items: T[];
  getImage: (item: T) => string;
  onSelect: (item: T) => void;
  searchPlaceholder: string;
  /** Verilirse seçili öğe işaretlenir ve açılışta görünür alana kaydırılır. */
  selectedId?: string;
  /** "cover": kare kırpılmış görsel (kartlar); "contain": şeffaf görsel (spreyler). */
  fit?: "cover" | "contain";
  /** Arama kutusunun altında, filtrelerin üstünde gösterilecek ek kontroller. */
  toolbar?: React.ReactNode;
}

/**
 * Aranabilir, kaynağa göre süzülebilir ve sanallaştırılmış görsel ızgarası.
 * 1000+ öğede sadece görünen satırlar render edilir.
 */
export const AssetGrid = <T extends GridAsset>({
  items,
  getImage,
  onSelect,
  searchPlaceholder,
  selectedId,
  fit = "cover",
  toolbar,
}: AssetGridProps<T>) => {
  const { lang } = useLanguage();
  const t = useTranslations();

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [filter, setFilter] = useState<ContentFilterValue>("all");

  const counts = useMemo(() => countByContentFilter(items), [items]);

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLocaleLowerCase(lang);
    return items.filter(
      (item) =>
        matchesContentFilter(item, filter) &&
        (!search ||
          // Kaynağa göre de aranabilir: "gekko" -> Gekko Teçhizatı içerikleri
          `${item.name} ${item.source?.name ?? ""}`
            .toLocaleLowerCase(lang)
            .includes(search))
    );
  }, [items, deferredQuery, filter, lang]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState(96);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const width = entry.contentRect.width;
      setTileSize((width - GAP * (COLUMNS - 1)) / COLUMNS);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // eslint-disable-next-line react-hooks/incompatible-library -- useVirtualizer memoize edilemeyen fonksiyonlar döndürür; bu bileşende sorun değil.
  const virtualizer = useVirtualizer({
    count: Math.ceil(filtered.length / COLUMNS),
    getScrollElement: () => scrollRef.current,
    estimateSize: () => tileSize + GAP,
    overscan: 3,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [tileSize, virtualizer]);

  // Açılışta seçili öğeyi görünür alana getir.
  const scrolledToSelection = useRef(false);
  useEffect(() => {
    if (scrolledToSelection.current || !selectedId || items.length === 0) return;
    scrolledToSelection.current = true;

    const index = items.findIndex((item) => item.id === selectedId);
    if (index >= 0) {
      virtualizer.scrollToIndex(Math.floor(index / COLUMNS), { align: "center" });
    }
  }, [items, selectedId, virtualizer]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-2 border-b p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              virtualizer.scrollToOffset(0);
            }}
            placeholder={searchPlaceholder}
            className="pl-9"
            type="search"
          />
        </div>
        {toolbar}
        <ContentFilter
          value={filter}
          counts={counts}
          onChange={(next) => {
            setFilter(next);
            virtualizer.scrollToOffset(0);
          }}
        />
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {t.no_results}
          </p>
        ) : (
          <div
            className="relative w-full"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualizer.getVirtualItems().map((row) => (
              <div
                key={row.key}
                className="absolute left-0 grid w-full"
                style={{
                  top: row.start,
                  gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
                  gap: GAP,
                }}
              >
                {filtered
                  .slice(row.index * COLUMNS, row.index * COLUMNS + COLUMNS)
                  .map((item) => {
                    const selected = item.id === selectedId;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        title={
                          item.source
                            ? `${item.name}\n${item.source.name}`
                            : item.name
                        }
                        aria-label={item.name}
                        aria-pressed={selectedId ? selected : undefined}
                        onClick={() => onSelect(item)}
                        className={cn(
                          "group relative aspect-square overflow-hidden rounded-sm outline-none ring-offset-2 ring-offset-card transition focus-visible:ring-2 focus-visible:ring-ring",
                          fit === "cover" ? "bg-muted" : "bg-grid bg-muted/50",
                          selected
                            ? "ring-2 ring-primary"
                            : "opacity-80 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={getImage(item)}
                          alt=""
                          fill
                          unoptimized
                          loading="lazy"
                          className={cn(
                            "transition-transform duration-300 group-hover:scale-110",
                            fit === "cover" ? "object-cover" : "object-contain p-1.5"
                          )}
                        />
                        {item.rare && (
                          <RareBadge className="absolute top-1 left-1" />
                        )}
                        {selected && (
                          <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
