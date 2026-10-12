"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, Search } from "lucide-react";
import {
  ContentFilter,
  RareBadge,
} from "@/components/studio/pickers/content-filter";
import { Input } from "@/components/ui/input";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { useTranslations } from "@/hooks/use-translations";
import { cardArt } from "@/lib/card/assets";
import {
  countByContentFilter,
  matchesContentFilter,
  type ContentFilter as ContentFilterValue,
} from "@/lib/card/filter";
import { cn } from "@/lib/utils";
import { useCardStore } from "@/stores/card-store";
import type { Catalog } from "@/types/catalog";

const COLUMNS = 4;
const GAP = 8;

const selectCards = (catalog: Catalog) => catalog.cards;

export const CardPicker = () => {
  const lang = useCardStore((state) => state.config.lang);
  const cardId = useCardStore((state) => state.config.cardId);
  const update = useCardStore((state) => state.update);
  const { data: cards = [] } = useStudioCatalog(selectCards);
  const t = useTranslations();

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [filter, setFilter] = useState<ContentFilterValue>("all");

  const counts = useMemo(() => countByContentFilter(cards), [cards]);

  const filtered = useMemo(() => {
    const search = deferredQuery.trim().toLocaleLowerCase(lang);
    return cards.filter(
      (card) =>
        matchesContentFilter(card, filter) &&
        (!search ||
          // Kaynağa göre de aranabilir: "gekko" -> Gekko Teçhizatı kartları
          `${card.name} ${card.source?.name ?? ""}`
            .toLocaleLowerCase(lang)
            .includes(search))
    );
  }, [cards, deferredQuery, filter, lang]);

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

  const rowCount = Math.ceil(filtered.length / COLUMNS);

  // 1000+ kartın sadece görünen satırları render edilir.
  // eslint-disable-next-line react-hooks/incompatible-library -- useVirtualizer memoize edilemeyen fonksiyonlar döndürür; bu bileşende sorun değil.
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => tileSize + GAP,
    overscan: 3,
  });

  useEffect(() => {
    virtualizer.measure();
  }, [tileSize, virtualizer]);

  // Açılışta seçili kartı görünür alana getir.
  const scrolledToSelection = useRef(false);
  useEffect(() => {
    if (scrolledToSelection.current || cards.length === 0) return;
    scrolledToSelection.current = true;

    const index = cards.findIndex((card) => card.id === cardId);
    if (index >= 0) {
      virtualizer.scrollToIndex(Math.floor(index / COLUMNS), { align: "center" });
    }
  }, [cards, cardId, virtualizer]);

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
            placeholder={t.search_cards}
            className="pl-9"
            type="search"
          />
        </div>
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
                  .map((card) => {
                    const selected = card.id === cardId;

                    return (
                      <button
                        key={card.id}
                        type="button"
                        title={
                          card.source
                            ? `${card.name}
${card.source.name}`
                            : card.name
                        }
                        aria-label={card.name}
                        aria-pressed={selected}
                        onClick={() => update({ cardId: card.id })}
                        className={cn(
                          "group relative aspect-square overflow-hidden rounded-sm bg-muted outline-none ring-offset-2 ring-offset-card transition focus-visible:ring-2 focus-visible:ring-ring",
                          selected
                            ? "ring-2 ring-primary"
                            : "opacity-75 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={cardArt(card.id, "smallart")}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {card.rare && (
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
