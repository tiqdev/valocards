"use client";

import { useEffect, useRef, useState } from "react";
import type Konva from "konva";
import { useQueryClient } from "@tanstack/react-query";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { WallpaperPanel } from "@/components/wallpaper/wallpaper-panel";
import { WallpaperStage } from "@/components/wallpaper/wallpaper-stage";
import type { LanguageCode } from "@/lib/i18n";
import { catalogQuery } from "@/queries/catalog";
import { useWallpaperAssets } from "@/queries/wallpaper";
import { useWallpaperStore } from "@/stores/wallpaper-store";

export const WallpaperStudio = ({ initialLang }: { initialLang: LanguageCode }) => {
  const [lang, setLang] = useState(initialLang);
  const isPanelOpen = useWallpaperStore((state) => state.isPanelOpen);
  const stageRef = useRef<Konva.Stage | null>(null);

  const queryClient = useQueryClient();
  const { data: gameVersion } = useWallpaperAssets(lang, (assets) => assets.version);

  // Ajanlar ve kartlar katalogdan gelir; panel açılmadan arka planda yüklenir.
  // Render sırasında değil mount sonrası başlatılır (sunucuda ve hydration öncesi çalışmasın).
  useEffect(() => {
    void queryClient.prefetchQuery(catalogQuery(lang));
  }, [queryClient, lang]);

  // Kaydedilmiş tasarım (localStorage) client'ta mount sonrası yüklenir.
  useEffect(() => {
    void useWallpaperStore.persist.rehydrate();
  }, []);

  return (
    <I18nProvider lang={lang} onLangChange={setLang}>
      <div className="flex h-svh flex-col">
        <main className="flex min-h-0 flex-1">
          <WallpaperStage stageRef={stageRef} />
        </main>
        <SiteFooter panelOpen={isPanelOpen} gameVersion={gameVersion} />
        <WallpaperPanel />
      </div>
    </I18nProvider>
  );
};
