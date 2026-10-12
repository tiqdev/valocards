"use client";

import { motion } from "motion/react";
import { RectangleHorizontal, RectangleVertical, RotateCw } from "lucide-react";
import { CARD_SIZE, PlayerCard } from "@/components/card/player-card";
import { CardActions } from "@/components/studio/card-actions";
import { FitToContainer } from "@/components/studio/fit-to-container";
import { LanguageSelect } from "@/components/studio/language-select";
import { Logo } from "@/components/studio/logo";
import { ThemeToggle } from "@/components/studio/theme-toggle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { useTranslations } from "@/hooks/use-translations";
import { resolveCardData } from "@/lib/card/resolve";
import { useCardStore } from "@/stores/card-store";

const PreviewToolbar = () => {
  const layout = useCardStore((state) => state.config.layout);
  const fade = useCardStore((state) => state.config.fade);
  const update = useCardStore((state) => state.update);
  const t = useTranslations();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={layout}
        onValueChange={(value) => {
          if (value === "vertical" || value === "horizontal") {
            update({ layout: value });
          }
        }}
        className="bg-card"
      >
        <ToggleGroupItem value="vertical" className="gap-1.5 px-3">
          <RectangleVertical />
          <span className="font-display text-xs uppercase tracking-wider">
            {t.vertical_label}
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem value="horizontal" className="gap-1.5 px-3">
          <RectangleHorizontal />
          <span className="font-display text-xs uppercase tracking-wider">
            {t.horizontal_label}
          </span>
        </ToggleGroupItem>
      </ToggleGroup>

      {layout === "vertical" && (
        <div className="flex h-8 items-center gap-2 rounded-md border bg-card px-3">
          <Switch
            id="fade"
            checked={fade}
            onCheckedChange={(checked) => update({ fade: checked })}
          />
          <Label
            htmlFor="fade"
            className="font-display text-xs uppercase tracking-wider"
          >
            {t.fade_label}
          </Label>
        </div>
      )}
    </div>
  );
};

const LivePreview = () => {
  const config = useCardStore((state) => state.config);
  const { data: catalog, isError, refetch } = useStudioCatalog();
  const t = useTranslations();

  if (!catalog) {
    return isError ? (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">{t.fetch_error}</p>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          <RotateCw />
          {t.retry}
        </Button>
      </div>
    ) : (
      <div className="h-[60%] aspect-[268/640] animate-pulse rounded-md bg-muted" />
    );
  }

  const data = resolveCardData(config, catalog);
  const size = CARD_SIZE[data.layout];

  return (
    <FitToContainer key={data.layout} width={size.width} height={size.height}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="drop-shadow-[0_20px_40px_rgba(255,70,85,0.18)]"
      >
        <PlayerCard
          data={data}
          frameSrc="/card-frame.png"
          fontFamily="var(--font-condensed)"
        />
      </motion.div>
    </FitToContainer>
  );
};

export const PreviewStage = () => {
  const t = useTranslations();

  return (
    <section
      aria-label={t.preview}
      className="relative flex flex-col items-center gap-4 overflow-hidden bg-grid px-4 py-5 lg:min-h-0 lg:flex-1 lg:gap-6 lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <Logo />
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 lg:top-6 lg:right-6">
        <LanguageSelect />
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center gap-4 pt-16 lg:h-full lg:gap-6 lg:pt-14">
        <PreviewToolbar />
        <div className="flex h-[52svh] min-h-80 w-full items-center justify-center lg:h-auto lg:min-h-0 lg:flex-1">
          <LivePreview />
        </div>
        <CardActions />
      </div>
    </section>
  );
};
