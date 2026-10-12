"use client";

import { useMemo, useState } from "react";
import { Check, Gem } from "lucide-react";
import { ContentFilter } from "@/components/studio/pickers/content-filter";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { useTranslations } from "@/hooks/use-translations";
import {
  countByContentFilter,
  matchesContentFilter,
  type ContentFilter as ContentFilterValue,
} from "@/lib/card/filter";
import { cn } from "@/lib/utils";
import { useCardStore } from "@/stores/card-store";
import type { Catalog } from "@/types/catalog";

const selectTitles = (catalog: Catalog) => catalog.titles;

export const TitlePicker = () => {
  const titleId = useCardStore((state) => state.config.titleId);
  const update = useCardStore((state) => state.update);
  const { data: titles = [] } = useStudioCatalog(selectTitles);
  const t = useTranslations();

  const [filter, setFilter] = useState<ContentFilterValue>("all");
  const counts = useMemo(() => countByContentFilter(titles), [titles]);
  const filtered = useMemo(
    () => titles.filter((title) => matchesContentFilter(title, filter)),
    [titles, filter]
  );

  return (
    <Command
      // Klavye vurgusu seçili ünvandan başlasın (varsayılan: ilk öğe).
      defaultValue={titleId}
      className="min-h-0 flex-1 rounded-none bg-transparent"
    >
      <div className="flex flex-col gap-2 border-b p-3 [&_[data-slot=command-input-wrapper]]:rounded-md [&_[data-slot=command-input-wrapper]]:border">
        <CommandInput placeholder={t.search_titles} />
        <ContentFilter value={filter} onChange={setFilter} counts={counts} />
      </div>
      <CommandList className="max-h-none min-h-0 flex-1 p-2">
        <CommandEmpty>{t.no_results}</CommandEmpty>
        {filtered.map((title) => {
          const selected = title.id === titleId;

          return (
            <CommandItem
              key={title.id}
              value={title.id}
              // Kaynağa göre de aranabilir: "champions" -> Champions Bileti ünvanları
              keywords={[title.text, title.source?.name ?? ""]}
              onSelect={() => update({ titleId: title.id })}
              className="gap-2"
            >
              <span
                className={cn(
                  "flex-1 truncate font-display text-sm uppercase tracking-wide",
                  selected && "text-primary"
                )}
              >
                {title.text}
              </span>
              {title.source && (
                <span className="max-w-[45%] truncate text-[11px] text-muted-foreground">
                  {title.source.name}
                </span>
              )}
              {title.rare && (
                <Gem className="size-3.5 text-amber-400" aria-label={t.rare_label} />
              )}
              {selected && <Check className="text-primary" />}
            </CommandItem>
          );
        })}
      </CommandList>
    </Command>
  );
};
