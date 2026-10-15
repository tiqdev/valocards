"use client";

import { toast } from "sonner";
import { DESKTOP_QUERY } from "@/hooks/use-media-query";
import { useTranslations } from "@/hooks/use-translations";
import { loadImage, opaqueBounds } from "@/lib/wallpaper/image";
import {
  useWallpaperStore,
  type WallpaperElementKind,
} from "@/stores/wallpaper-store";

/**
 * Görseli yükleyip gerçek oranıyla tuvale ekler. Mobilde ekledikten sonra
 * drawer kapanır ki kullanıcı öğeyi hemen görüp düzenleyebilsin.
 */
export const useAddToCanvas = () => {
  const addElement = useWallpaperStore((state) => state.addElement);
  const setPanelOpen = useWallpaperStore((state) => state.setPanelOpen);
  const t = useTranslations();

  return async (kind: WallpaperElementKind, src: string) => {
    try {
      const image = await loadImage(src);
      // Kartlar dolu dikdörtgen; ajan ve spreylerin şeffaf kenarları kırpılır.
      const crop =
        kind === "card"
          ? { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight }
          : opaqueBounds(image);
      addElement(kind, src, crop);
      if (!window.matchMedia(DESKTOP_QUERY).matches) setPanelOpen(false);
    } catch {
      toast.error(t.fetch_error);
    }
  };
};
