"use client";

import { ResponsivePanel } from "@/components/layout/responsive-panel";
import { EditorTabs } from "@/components/studio/editor-tabs";
import { useTranslations } from "@/hooks/use-translations";
import { useCardStore } from "@/stores/card-store";

export const EditorPanel = () => {
  const isOpen = useCardStore((state) => state.isEditorOpen);
  const setOpen = useCardStore((state) => state.setEditorOpen);
  const t = useTranslations();

  return (
    <ResponsivePanel open={isOpen} onOpenChange={setOpen} title={t.editor_title}>
      <EditorTabs />
    </ResponsivePanel>
  );
};
