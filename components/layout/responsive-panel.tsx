"use client";

import { useEffect } from "react";
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

export const PANEL_WIDTH = 440;

/**
 * Masaüstünde soldan açılan, sahnenin görünmeye devam ettiği (modal olmayan)
 * bir Sheet; mobilde alttan açılan bir Drawer.
 */
export const ResponsivePanel = ({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  // Masaüstünde panel açık başlar; mobilde sahne tam ekran görünür.
  useEffect(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches) onOpenChange(true);
    // Sadece ilk yüklemede.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent
          side="left"
          style={{ width: PANEL_WIDTH }}
          className="gap-0 bg-card p-0 sm:max-w-none"
          // Sahnedeki kontrollerle çalışırken panel kapanmasın.
          onInteractOutside={(event) => event.preventDefault()}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="font-display text-lg font-bold uppercase tracking-widest">
              {title}
            </SheetTitle>
            <SheetDescription className="sr-only">{title}</SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80svh] bg-card">
        <DrawerHeader className="py-2">
          <DrawerTitle className="font-display text-base font-bold uppercase tracking-widest">
            {title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">{title}</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
};
