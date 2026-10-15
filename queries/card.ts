import { useMutation } from "@tanstack/react-query";
import { fetchCardImage } from "@/lib/api/client";
import type { CardConfig, ExportScale } from "@/lib/card/config";
import { saveBlob } from "@/lib/download";

export const useDownloadCard = () =>
  useMutation({
    mutationFn: async ({
      config,
      scale,
    }: {
      config: CardConfig;
      scale: ExportScale;
    }) => {
      const blob = await fetchCardImage(config, scale);
      saveBlob(
        blob,
        `${config.name || "valocards"}_${config.layout}@${scale}x.png`
      );
    },
  });
