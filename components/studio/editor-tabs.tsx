"use client";

import { PanelTabs } from "@/components/layout/panel-tabs";
import { AgentPicker } from "@/components/studio/pickers/agent-picker";
import { CardPicker } from "@/components/studio/pickers/card-picker";
import { PlayerFields } from "@/components/studio/pickers/player-fields";
import { RankPicker } from "@/components/studio/pickers/rank-picker";
import { TitlePicker } from "@/components/studio/pickers/title-picker";
import { useTranslations } from "@/hooks/use-translations";
import { useCardStore } from "@/stores/card-store";

/** Kart editörünün sekmeleri; masaüstünde Sheet, mobilde Drawer içinde. */
export const EditorTabs = () => {
  const activeTab = useCardStore((state) => state.activeTab);
  const setActiveTab = useCardStore((state) => state.setActiveTab);
  const t = useTranslations();

  return (
    <PanelTabs
      value={activeTab}
      onValueChange={setActiveTab}
      tabs={[
        { value: "player", label: t.tab_player, content: <PlayerFields /> },
        { value: "card", label: t.tab_card, content: <CardPicker />, scroll: "self" },
        { value: "agent", label: t.tab_agent, content: <AgentPicker /> },
        { value: "rank", label: t.tab_rank, content: <RankPicker /> },
        { value: "title", label: t.tab_title, content: <TitlePicker />, scroll: "self" },
      ]}
    />
  );
};
