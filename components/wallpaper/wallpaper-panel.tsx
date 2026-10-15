"use client";

import { useState } from "react";
import { RectangleHorizontal, RectangleVertical } from "lucide-react";
import { useLanguage } from "@/components/i18n-provider";
import { PanelTabs } from "@/components/layout/panel-tabs";
import { ResponsivePanel } from "@/components/layout/responsive-panel";
import { AgentGrid } from "@/components/pickers/agent-grid";
import { AssetGrid } from "@/components/pickers/asset-grid";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BackgroundTab } from "@/components/wallpaper/background-tab";
import { useAddToCanvas } from "@/components/wallpaper/use-add-to-canvas";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { useTranslations } from "@/hooks/use-translations";
import { agentPortrait, cardArt, sprayIcon } from "@/lib/card/assets";
import { useWallpaperAssets } from "@/queries/wallpaper";
import { useWallpaperStore } from "@/stores/wallpaper-store";
import type { Catalog, CatalogCard } from "@/types/catalog";
import type { WallpaperAssets, WallpaperSpray } from "@/types/wallpaper";

type WallpaperTab = "background" | "agents" | "sprays" | "cards";

const selectSprays = (assets: WallpaperAssets) => assets.sprays;
const selectCards = (catalog: Catalog) => catalog.cards;
const sprayThumbnail = (spray: WallpaperSpray) => sprayIcon(spray.id);
const cardThumbnail = (card: CatalogCard) => cardArt(card.id, "smallart");

const AddHint = () => {
  const t = useTranslations();
  return <p className="mb-3 text-xs text-muted-foreground">{t.add_hint}</p>;
};

const AgentsTab = () => {
  const addToCanvas = useAddToCanvas();

  return (
    <>
      <AddHint />
      <AgentGrid
        onSelect={(agent) => void addToCanvas("agent", agentPortrait(agent.id))}
      />
    </>
  );
};

const SpraysTab = () => {
  const { lang } = useLanguage();
  const { data: sprays = [] } = useWallpaperAssets(lang, selectSprays);
  const addToCanvas = useAddToCanvas();
  const t = useTranslations();

  return (
    <AssetGrid
      items={sprays}
      getImage={sprayThumbnail}
      fit="contain"
      onSelect={(spray) => void addToCanvas("spray", sprayIcon(spray.id))}
      searchPlaceholder={t.search_sprays}
    />
  );
};

const CardsTab = () => {
  const { data: cards = [] } = useStudioCatalog(selectCards);
  const addToCanvas = useAddToCanvas();
  const [art, setArt] = useState<"largeart" | "wideart">("largeart");
  const t = useTranslations();

  return (
    <AssetGrid
      items={cards}
      getImage={cardThumbnail}
      onSelect={(card) => void addToCanvas("card", cardArt(card.id, art))}
      searchPlaceholder={t.search_cards}
      toolbar={
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
            {t.card_art_label}
          </span>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={art}
            onValueChange={(value) => {
              if (value === "largeart" || value === "wideart") setArt(value);
            }}
          >
            <ToggleGroupItem value="largeart" className="gap-1.5 px-2.5">
              <RectangleVertical />
              <span className="font-display text-xs uppercase">{t.vertical_label}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="wideart" className="gap-1.5 px-2.5">
              <RectangleHorizontal />
              <span className="font-display text-xs uppercase">{t.horizontal_label}</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      }
    />
  );
};

export const WallpaperPanel = () => {
  const isOpen = useWallpaperStore((state) => state.isPanelOpen);
  const setOpen = useWallpaperStore((state) => state.setPanelOpen);
  const [tab, setTab] = useState<WallpaperTab>("background");
  const t = useTranslations();

  return (
    <ResponsivePanel open={isOpen} onOpenChange={setOpen} title={t.wallpaper_panel_title}>
      <PanelTabs
        value={tab}
        onValueChange={setTab}
        tabs={[
          { value: "background", label: t.wp_tab_background, content: <BackgroundTab /> },
          { value: "agents", label: t.wp_tab_agents, content: <AgentsTab /> },
          { value: "sprays", label: t.wp_tab_sprays, content: <SpraysTab />, scroll: "self" },
          { value: "cards", label: t.wp_tab_cards, content: <CardsTab />, scroll: "self" },
        ]}
      />
    </ResponsivePanel>
  );
};
