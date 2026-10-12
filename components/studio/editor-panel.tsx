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

export const EditorPanel = () => {
  const activeTab = useCardStore((state) => state.activeTab);
  const setActiveTab = useCardStore((state) => state.setActiveTab);
  const t = useTranslations();

  return (
    <aside className="flex flex-col border-t bg-card/40 lg:min-h-0 lg:w-[440px] lg:shrink-0 lg:border-t-0 lg:border-r">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (isEditorTab(value)) setActiveTab(value);
        }}
        className="flex flex-1 flex-col gap-0 lg:min-h-0"
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
              <span className="text-sm leading-tight">
                {t[TAB_LABELS[tab]]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="player" className="p-4 lg:overflow-y-auto">
          <PlayerFields />
        </TabsContent>
        <TabsContent value="card" className="flex h-[70svh] min-h-0 flex-none flex-col lg:h-auto lg:flex-1">
          <CardPicker />
        </TabsContent>
        <TabsContent value="agent" className="p-4 lg:overflow-y-auto">
          <AgentPicker />
        </TabsContent>
        <TabsContent value="rank" className="p-4 lg:overflow-y-auto">
          <RankPicker />
        </TabsContent>
        <TabsContent value="title" className="flex h-[70svh] min-h-0 flex-none flex-col lg:h-auto lg:flex-1">
          <TitlePicker />
        </TabsContent>
      </Tabs>
    </aside>
  );
};
