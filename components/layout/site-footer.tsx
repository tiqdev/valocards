"use client";

import { PANEL_WIDTH } from "@/components/layout/responsive-panel";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

// "13.06.00.5590001" -> "13.06"
export const toPatch = (version: string) =>
  version.split(".").slice(0, 2).join(".");

/**
 * Masaüstünde yan panel açıkken içerik panelin sağına kayar. Oyun sürümü,
 * sunucuda hazırlanan veriden gelmeli; yoksa hydration uyuşmazlığı olur.
 */
export const SiteFooter = ({
  panelOpen,
  gameVersion,
}: {
  panelOpen: boolean;
  gameVersion?: string;
}) => {
  const patch = gameVersion && gameVersion !== "unknown" ? toPatch(gameVersion) : null;
  const t = useTranslations();

  return (
    <footer
      style={{ "--panel-width": `${PANEL_WIDTH}px` } as React.CSSProperties}
      className={cn(
        "flex shrink-0 flex-col gap-2 border-t px-4 py-3 text-[11px] text-muted-foreground transition-[padding] duration-300 ease-in-out sm:flex-row sm:items-center sm:justify-between lg:px-6",
        panelOpen && "lg:pl-[calc(var(--panel-width)+1.5rem)]"
      )}
    >
      <p className="max-w-3xl leading-relaxed">{t.disclaimer}</p>
      <div className="flex shrink-0 items-center gap-4">
        {patch && (
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
