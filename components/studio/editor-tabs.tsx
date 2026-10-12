"use client";

import { AgentPicker } from "@/components/studio/pickers/agent-picker";
import { CardPicker } from "@/components/studio/pickers/card-picker";
import { PlayerFields } from "@/components/studio/pickers/player-fields";
import { RankPicker } from "@/components/studio/pickers/rank-picker";
import { TitlePicker } from "@/components/studio/pickers/title-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "@/hooks/use-translations";
import type { Translations } from "@/lib/i18n";
import { EDITOR_TABS, useCardStore, type EditorTab } from "@/stores/card-store";

const TAB_LABELS: Record<EditorTab, keyof Translations> = {
  player: "tab_player",
  card: "tab_card",
  agent: "tab_agent",
  rank: "tab_rank",
  title: "tab_title",
};

const isEditorTab = (value: string): value is EditorTab =>
  EDITOR_TABS.some((tab) => tab === value);

/** Editör sekmeleri; masaüstünde Sheet, mobilde Drawer içinde kullanılır. */
export const EditorTabs = () => {
  const activeTab = useCardStore((state) => state.activeTab);
  const setActiveTab = useCardStore((state) => state.setActiveTab);
  const t = useTranslations();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (isEditorTab(value)) setActiveTab(value);
      }}
      className="flex min-h-0 flex-1 flex-col gap-0"
    >
      <TabsList
        variant="line"
        className="h-auto! w-full justify-between gap-0 border-b px-2 py-0"
      >
        {EDITOR_TABS.map((tab, index) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="h-12 flex-col gap-0 px-1 font-display uppercase tracking-wider after:bg-primary! data-[state=active]:text-primary!"
          >
            <span className="text-[10px] leading-none opacity-60">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm leading-tight">{t[TAB_LABELS[tab]]}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="player" className="min-h-0 overflow-y-auto p-4">
        <PlayerFields />
      </TabsContent>
      <TabsContent value="card" className="flex min-h-0 flex-col">
        <CardPicker />
      </TabsContent>
      <TabsContent value="agent" className="min-h-0 overflow-y-auto p-4">
        <AgentPicker />
      </TabsContent>
      <TabsContent value="rank" className="min-h-0 overflow-y-auto p-4">
        <RankPicker />
      </TabsContent>
      <TabsContent value="title" className="flex min-h-0 flex-col">
        <TitlePicker />
      </TabsContent>
    </Tabs>
  );
};
