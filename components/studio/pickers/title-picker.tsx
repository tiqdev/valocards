"use client";

import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";
import { useCardStore } from "@/stores/card-store";
import type { Catalog } from "@/types/catalog";

const selectTitles = (catalog: Catalog) => catalog.titles;

export const TitlePicker = () => {
  const titleId = useCardStore((state) => state.config.titleId);
  const update = useCardStore((state) => state.update);
  const { data: titles = [] } = useStudioCatalog(selectTitles);
  const t = useTranslations();

  return (
    <Command
      // Klavye vurgusu seçili ünvandan başlasın (varsayılan: ilk öğe).
      defaultValue={titleId}
      className="min-h-0 flex-1 rounded-none bg-transparent"
    >
      <div className="border-b p-3 [&_[data-slot=command-input-wrapper]]:rounded-md [&_[data-slot=command-input-wrapper]]:border">
        <CommandInput placeholder={t.search_titles} />
      </div>
      <CommandList className="max-h-none min-h-0 flex-1 p-2">
        <CommandEmpty>{t.no_results}</CommandEmpty>
        {titles.map((title) => {
          const selected = title.id === titleId;

          return (
            <CommandItem
              key={title.id}
              value={title.id}
              keywords={[title.text]}
              onSelect={() => update({ titleId: title.id })}
              className={cn(
                "font-display text-sm uppercase tracking-wide",
                selected && "text-primary"
              )}
            >
              <span className="flex-1 truncate">{title.text}</span>
              {selected && <Check className="text-primary" />}
            </CommandItem>
          );
        })}
      </CommandList>
    </Command>
  );
};
