"use client";

import Image from "next/image";
import { Ban, Check } from "lucide-react";
import { useLanguage } from "@/components/i18n-provider";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";
import { useWallpaperAssets } from "@/queries/wallpaper";
import { useWallpaperStore } from "@/stores/wallpaper-store";
import type { WallpaperAssets } from "@/types/wallpaper";

// Valorant paletinden ve oyunun tonlarından seçilmiş renkler.
const SWATCHES = [
  "#0f1923",
  "#000000",
  "#1f2e3b",
  "#ff4655",
  "#bd3944",
  "#ece8e1",
  "#433178",
  "#25607a",
  "#1a5f46",
  "#80451b",
];

const selectMaps = (assets: WallpaperAssets) => assets.maps;

const SectionLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <Label
    htmlFor={htmlFor}
    className="font-display text-xs uppercase tracking-widest text-muted-foreground"
  >
    {children}
  </Label>
);

export const BackgroundTab = () => {
  const { lang } = useLanguage();
  const background = useWallpaperStore((state) => state.background);
  const setBackground = useWallpaperStore((state) => state.setBackground);
  const checkpoint = useWallpaperStore((state) => state.checkpoint);
  const { data: maps = [] } = useWallpaperAssets(lang, selectMaps);
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <SectionLabel>{t.bg_colors}</SectionLabel>
        <div className="grid grid-cols-6 gap-2">
          {SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={color}
              aria-pressed={background.color === color}
              onClick={() => setBackground({ color })}
              className={cn(
                "flex aspect-square items-center justify-center rounded-sm border outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                background.color === color
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                  : "hover:scale-105"
              )}
              style={{ backgroundColor: color }}
            >
              {background.color === color && (
                <Check className="size-4 mix-blend-difference text-white" />
              )}
            </button>
          ))}
          <label
            title={t.bg_custom_color}
            className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-sm border bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)]"
          >
            <span className="sr-only">{t.bg_custom_color}</span>
            <input
              type="color"
              value={background.color}
              onPointerDown={checkpoint}
              onChange={(event) =>
                setBackground({ color: event.target.value }, { transient: true })
              }
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionLabel>{t.bg_maps}</SectionLabel>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            aria-pressed={!background.mapId}
            onClick={() => setBackground({ mapId: null, mapSrc: null })}
            className={cn(
              "flex h-12 items-center gap-2 rounded-sm border px-3 font-display text-sm uppercase tracking-wider outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
              !background.mapId
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Ban className="size-4" />
            {t.bg_no_map}
          </button>
          {maps.map((map, index) => {
            const selected = map.id === background.mapId;

            return (
              <button
                key={map.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setBackground({ mapId: map.id, mapSrc: map.splash })}
                className={cn(
                  "group relative aspect-[456/100] overflow-hidden rounded-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                    : "opacity-80 hover:opacity-100"
                )}
              >
                <Image
                  src={map.thumbnail}
                  alt=""
                  fill
                  unoptimized
                  // İlk görünenler hemen yüklensin (LCP).
                  loading={index < 4 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-y-0 left-0 flex items-center bg-linear-to-r from-black/70 to-transparent pr-10 pl-3 font-display text-base font-bold uppercase tracking-widest text-white">
                  {map.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {background.mapId && (
        <section className="sticky bottom-0 -mx-4 -mb-4 flex flex-col gap-3 border-t bg-card p-4">
          <div className="flex items-center justify-between">
            <SectionLabel htmlFor="dim">{t.bg_dim}</SectionLabel>
            <span className="font-display text-sm">
              {Math.round(background.dim * 100)}%
            </span>
          </div>
          <Slider
            id="dim"
            // Mobil drawer içinde kaydırırken drawer sürüklenmesin.
            data-vaul-no-drag=""
            min={0}
            max={0.8}
            step={0.05}
            value={[background.dim]}
            onPointerDown={checkpoint}
            onValueChange={([dim]) => {
              if (dim !== undefined) setBackground({ dim }, { transient: true });
            }}
          />
        </section>
      )}
    </div>
  );
};
