import { useEffect, useState } from "react";

const cache = new Map<string, Promise<HTMLImageElement>>();

/**
 * Görseli canvas'ta kullanılabilecek şekilde yükler. media.valorant-api.com
 * CORS'a izin verdiği için crossOrigin ile yüklenen görseller canvas'ı
 * "kirletmez" ve PNG olarak dışa aktarılabilir.
 */
export const loadImage = (src: string) => {
  let promise = cache.get(src);

  if (!promise) {
    promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = () => {
        cache.delete(src);
        reject(new Error(`Image failed to load: ${src}`));
      };
      image.src = src;
    });
    cache.set(src, promise);
  }

  return promise;
};

/** Yüklenene kadar null döner. */
export const useLoadedImage = (src: string | null) => {
  const [loaded, setLoaded] = useState<{ src: string; image: HTMLImageElement } | null>(null);

  useEffect(() => {
    if (!src) return;
    let active = true;

    loadImage(src)
      .then((image) => {
        if (active) setLoaded({ src, image });
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [src]);

  return src && loaded?.src === src ? loaded.image : null;
};

export interface ImageCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TRIM_SAMPLE_SIZE = 256;
const TRIM_ALPHA_THRESHOLD = 10;

/**
 * Görselin şeffaf olmayan kısmının sınırları. Ajan portrelerinde karakterin
 * etrafında geniş şeffaf boşluk var; kırpınca seçim kutusu karakteri sarar.
 * Hız için görselin küçültülmüş kopyası taranır.
 */
export const opaqueBounds = (image: HTMLImageElement): ImageCrop => {
  const full = { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
  const scale = Math.min(1, TRIM_SAMPLE_SIZE / Math.max(full.width, full.height));
  const width = Math.max(1, Math.round(full.width * scale));
  const height = Math.max(1, Math.round(full.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return full;

  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3]! > TRIM_ALPHA_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) return full;

  // Örnekleme hassasiyeti için bir piksel pay bırakılır.
  const left = Math.max(0, (minX - 1) / scale);
  const top = Math.max(0, (minY - 1) / scale);
  const right = Math.min(full.width, (maxX + 2) / scale);
  const bottom = Math.min(full.height, (maxY + 2) / scale);

  return { x: left, y: top, width: right - left, height: bottom - top };
};
