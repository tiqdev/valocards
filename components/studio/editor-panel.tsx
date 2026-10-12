"use client";

import { useEffect } from "react";
import { EditorTabs } from "@/components/studio/editor-tabs";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DESKTOP_QUERY, useMediaQuery } from "@/hooks/use-media-query";
import { useTranslations } from "@/hooks/use-translations";
import { useCardStore } from "@/stores/card-store";

export const EDITOR_WIDTH = 440;

/**
 * Masaüstünde soldan açılan, kartın görünmeye devam ettiği (modal olmayan)
 * bir Sheet; mobilde alttan açılan bir Drawer.
 */
export const EditorPanel = () => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const isOpen = useCardStore((state) => state.isEditorOpen);
  const setOpen = useCardStore((state) => state.setEditorOpen);
  const t = useTranslations();

  // Masaüstünde editör açık başlar; mobilde kart tam ekran görünür.
  useEffect(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches) setOpen(true);
  }, [setOpen]);

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={setOpen} modal={false}>
        <SheetContent
          side="left"
          style={{ width: EDITOR_WIDTH }}
          className="gap-0 bg-card p-0 sm:max-w-none"
          // Önizlemedeki kontrollerle çalışırken panel kapanmasın.
          onInteractOutside={(event) => event.preventDefault()}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="font-display text-lg font-bold uppercase tracking-widest">
              {t.editor_title}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {t.editor_title}
            </SheetDescription>
          </SheetHeader>
          <EditorTabs />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent className="h-[80svh] bg-card">
        <DrawerHeader className="py-2">
          <DrawerTitle className="font-display text-base font-bold uppercase tracking-widest">
            {t.editor_title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {t.editor_title}
          </DrawerDescription>
        </DrawerHeader>
        <EditorTabs />
      </DrawerContent>
    </Drawer>
  );
};
