import { useMutation } from "@tanstack/react-query";
import { fetchCardImage } from "@/lib/api/client";
import type { CardConfig, ExportScale } from "@/lib/card/config";

const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

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
