"use client";

import { PanelLeftClose, Pencil } from "lucide-react";
import { LanguageSelect } from "@/components/layout/language-select";
import { Logo } from "@/components/layout/logo";
import { ModeSwitch } from "@/components/layout/mode-switch";
import { PANEL_WIDTH } from "@/components/layout/responsive-panel";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

interface StageProps {
  /** Ekran okuyucular için bölge adı. */
  label: string;
  panelOpen: boolean;
  onPanelOpenChange: (open: boolean) => void;
  /** Panel kapalıyken açma butonunda görünen metin. */
  openPanelLabel: string;
  children: React.ReactNode;
}

/**
 * Kart ve duvar kağıdı sayfalarının ortak sahnesi: ızgara arka plan, üst satır
 * (panel butonu, sayfa geçişi, logo, dil, tema) ve içerik. Masaüstünde panel
 * açıkken içerik panelin sağında kalan alana ortalanır.
 */
export const Stage = ({
  label,
  panelOpen,
  onPanelOpenChange,
  openPanelLabel,
  children,
}: StageProps) => {
  const t = useTranslations();

  return (
    <section
      aria-label={label}
      className="relative flex min-h-0 flex-1 overflow-hidden bg-grid"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_75%)]" />

      <div
        style={{ "--panel-width": `${PANEL_WIDTH}px` } as React.CSSProperties}
        className={cn(
          "relative flex flex-1 flex-col items-center gap-4 px-4 pt-4 pb-5 transition-[padding] duration-300 ease-in-out lg:gap-6 lg:px-8 lg:pt-6 lg:pb-8",
          panelOpen && "lg:pl-[calc(var(--panel-width)+2rem)]"
        )}
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

        {/* Logo ortada, butonlar köşelerde; bar değil, sadece aynı hizada. */}
        <div className="relative z-20 flex h-12 w-full shrink-0 items-center justify-center">
          <div className="absolute left-0 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPanelOpenChange(!panelOpen)}
              aria-expanded={panelOpen}
              aria-label={panelOpen ? t.close_label : openPanelLabel}
              className="font-display uppercase tracking-wider"
            >
              {panelOpen ? <PanelLeftClose /> : <Pencil />}
              <span className="hidden sm:inline">
                {panelOpen ? t.close_label : openPanelLabel}
              </span>
            </Button>
            <ModeSwitch />
          </div>
          <Logo />
          <div className="absolute right-0 flex items-center gap-2">
            <LanguageSelect />
            <ThemeToggle />
          </div>
        </div>

        <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center gap-4 lg:gap-6">
          {children}
        </div>
      </div>
    </section>
  );
};
