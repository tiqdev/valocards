"use client";

import { useEffect } from "react";
import { EditorPanel } from "@/components/studio/editor-panel";
import { PreviewStage } from "@/components/studio/preview-stage";
import { SiteFooter } from "@/components/studio/site-footer";
import { useCardStore } from "@/stores/card-store";

export const Studio = () => {
  const lang = useCardStore((state) => state.config.lang);

  useEffect(() => {
    document.documentElement.lang = lang.slice(0, 2);
  }, [lang]);

  return (
    <div className="flex h-svh flex-col">
      <main className="flex min-h-0 flex-1">
        <PreviewStage />
      </main>
      <SiteFooter />
      <EditorPanel />
    </div>
  );
};
