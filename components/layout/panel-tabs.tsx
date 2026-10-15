"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface PanelTab<T extends string> {
  value: T;
  label: string;
  content: React.ReactNode;
  /**
   * "panel": içerik panel içinde kayar (form, ızgara vb.).
   * "self": içerik kendi kaydırmasını yönetir (sanallaştırılmış listeler).
   */
  scroll?: "panel" | "self";
}

/** Yan panelin numaralı sekmeleri (01 Oyuncu, 02 Kart ...). */
export const PanelTabs = <T extends string>({
  tabs,
  value,
  onValueChange,
}: {
  tabs: PanelTab<T>[];
  value: T;
  onValueChange: (value: T) => void;
}) => (
  <Tabs
    value={value}
    onValueChange={(next) => {
      const tab = tabs.find((item) => item.value === next);
      if (tab) onValueChange(tab.value);
    }}
    className="flex min-h-0 flex-1 flex-col gap-0"
  >
    <TabsList
      variant="line"
      className="h-auto! w-full justify-between gap-0 border-b px-2 py-0"
    >
      {tabs.map((tab, index) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="h-12 flex-col gap-0 px-1 font-display uppercase tracking-wider after:bg-primary! data-[state=active]:text-primary!"
        >
          <span className="text-[10px] leading-none opacity-60">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm leading-tight">{tab.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>

    {tabs.map((tab) => (
      <TabsContent
        key={tab.value}
        value={tab.value}
        className={
          tab.scroll === "self"
            ? "flex min-h-0 flex-col"
            : "min-h-0 overflow-y-auto p-4"
        }
      >
        {tab.content}
      </TabsContent>
    ))}
  </Tabs>
);
