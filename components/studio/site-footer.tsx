"use client";

import { EDITOR_WIDTH } from "@/components/studio/editor-panel";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";
import { useCardStore } from "@/stores/card-store";
import type { Catalog } from "@/types/catalog";

// "13.06.00.5590001" -> "13.06"
const selectPatch = (catalog: Catalog) =>
  catalog.version.split(".").slice(0, 2).join(".");

export const SiteFooter = () => {
  const isEditorOpen = useCardStore((state) => state.isEditorOpen);
  const { data: patch } = useStudioCatalog(selectPatch);
  const t = useTranslations();

  return (
    <footer
      style={{ "--editor-width": `${EDITOR_WIDTH}px` } as React.CSSProperties}
      className={cn(
        "flex shrink-0 flex-col gap-2 border-t px-4 py-3 text-[11px] text-muted-foreground transition-[padding] duration-300 ease-in-out sm:flex-row sm:items-center sm:justify-between lg:px-6",
        isEditorOpen && "lg:pl-[calc(var(--editor-width)+1.5rem)]"
      )}
    >
      <p className="max-w-3xl leading-relaxed">{t.disclaimer}</p>
      <div className="flex shrink-0 items-center gap-4">
        {patch && patch !== "unknown" && (
          <span className="font-display uppercase tracking-wider">
            {t.game_version}: {patch}
          </span>
        )}
        <a
          href="https://tiqdev.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="font-display text-sm font-bold tracking-wider text-primary drop-shadow-red"
        >
          🔴 tiqdev
        </a>
      </div>
    </footer>
  );
};
