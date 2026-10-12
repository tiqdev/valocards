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
    <div className="flex min-h-svh flex-col lg:h-svh">
      <main className="flex flex-1 flex-col lg:min-h-0 lg:flex-row-reverse">
        <PreviewStage />
        <EditorPanel />
      </main>
      <SiteFooter />
    </div>
  );
};
