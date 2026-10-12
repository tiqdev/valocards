"use client";

import { EDITOR_WIDTH } from "@/components/studio/editor-panel";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";
import { useCardStore } from "@/stores/card-store";

export const SiteFooter = () => {
  const isEditorOpen = useCardStore((state) => state.isEditorOpen);
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
      <a
        href="https://tiqdev.vercel.app"
        target="_blank"
        rel="noreferrer"
        className="shrink-0 font-display text-sm font-bold tracking-wider text-primary drop-shadow-red"
      >
        🔴 tiqdev
      </a>
    </footer>
  );
};
