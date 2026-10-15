"use client";

import { useCallback } from "react";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { EditorPanel } from "@/components/studio/editor-panel";
import { PreviewStage } from "@/components/studio/preview-stage";
import type { LanguageCode } from "@/lib/i18n";
import { useCatalog } from "@/queries/catalog";
import { useCardStore } from "@/stores/card-store";

export const Studio = () => {
  // Kart sayfasında dil, paylaşım linkinde yer aldığı için kart ayarlarında tutulur.
  const lang = useCardStore((state) => state.config.lang);
  const update = useCardStore((state) => state.update);
  const isEditorOpen = useCardStore((state) => state.isEditorOpen);
  // Kart sayfasında katalog sunucuda hazırlandığı için sürüm hydration ile uyumlu.
  const { data: gameVersion } = useCatalog(lang, (catalog) => catalog.version);
  const setLang = useCallback((next: LanguageCode) => update({ lang: next }), [update]);

  return (
    <I18nProvider lang={lang} onLangChange={setLang}>
      <div className="flex h-svh flex-col">
        <main className="flex min-h-0 flex-1">
          <PreviewStage />
        </main>
        <SiteFooter panelOpen={isEditorOpen} gameVersion={gameVersion} />
        <EditorPanel />
      </div>
    </I18nProvider>
  );
};
