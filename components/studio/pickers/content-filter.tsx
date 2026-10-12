"use client";

import { Gem } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslations } from "@/hooks/use-translations";
import {
  CONTENT_FILTERS,
  type ContentFilter as ContentFilterValue,
} from "@/lib/card/filter";
import type { Translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const FILTER_LABELS: Record<ContentFilterValue, keyof Translations> = {
  all: "filter_all",
  battlepass: "source_battlepass",
  agent: "source_agent",
  event: "source_event",
  rare: "rare_label",
};

const isContentFilter = (value: string): value is ContentFilterValue =>
  CONTENT_FILTERS.some((filter) => filter === value);

/** Kart ve ünvanları kaynağına (battle pass, ajan, etkinlik) veya nadirliğine göre süzer. */
export const ContentFilter = ({
  value,
  onChange,
  counts,
}: {
  value: ContentFilterValue;
  onChange: (value: ContentFilterValue) => void;
  counts: Record<ContentFilterValue, number>;
}) => {
  const t = useTranslations();

  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={value}
      onValueChange={(next) => {
        // Seçili filtreye tekrar tıklanınca boş değer gelir; "Tümü"ne dön.
        onChange(next && isContentFilter(next) ? next : "all");
      }}
      className="w-full flex-wrap justify-start gap-1.5"
    >
      {CONTENT_FILTERS.map((filter) => (
        <ToggleGroupItem
          key={filter}
          value={filter}
          title={filter === "rare" ? t.rare_hint : undefined}
          className={cn(
            "h-7 flex-none gap-1 rounded-sm! border px-2 font-display text-xs uppercase tracking-wider",
            "data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
          )}
        >
          {filter === "rare" && <Gem className="size-3 text-amber-400" />}
          {t[FILTER_LABELS[filter]]}
          <span className="text-[10px] opacity-60">{counts[filter]}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export const RareBadge = ({ className }: { className?: string }) => {
  const t = useTranslations();

  return (
    <span
      title={t.rare_hint}
      className={cn(
        "flex size-5 items-center justify-center rounded-full bg-black/70 text-amber-400",
        className
      )}
    >
      <Gem className="size-3" />
      <span className="sr-only">{t.rare_label}</span>
    </span>
  );
};
