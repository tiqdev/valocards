"use client";

import { Dices, Download, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { useTranslations } from "@/hooks/use-translations";
import { randomizeCardConfig, serializeCardConfig } from "@/lib/card/config";
import { useDownloadCard } from "@/queries/card";
import { useCardStoreApi } from "@/stores/card-store";

export const CardActions = () => {
  const store = useCardStoreApi();
  const { data: catalog } = useStudioCatalog();
  const download = useDownloadCard();
  const t = useTranslations();

  const handleDownload = () => {
    const toastId = toast.loading(t.downloading);
    download.mutate(store.getState().config, {
      onSuccess: () => toast.success(t.downloaded, { id: toastId }),
      onError: () => toast.error(t.download_error, { id: toastId }),
    });
  };

  const handleCopyLink = async () => {
    const query = serializeCardConfig(store.getState().config);
    await navigator.clipboard.writeText(
      `${window.location.origin}/?${query}`
    );
    toast.success(t.link_copied);
  };

  const handleRandomize = () => {
    if (!catalog) return;
    const { config, replace } = store.getState();
    replace(randomizeCardConfig(config, catalog));
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        size="lg"
        onClick={handleDownload}
        disabled={download.isPending}
        className="corner-cut rounded-none px-6 font-display text-sm font-bold uppercase tracking-widest"
      >
        {download.isPending ? <Loader2 className="animate-spin" /> : <Download />}
        {t.download_label}
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={() => void handleCopyLink()}
        className="font-display text-sm uppercase tracking-wider"
      >
        <Link2 />
        {t.copy_link}
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={handleRandomize}
        disabled={!catalog}
        className="font-display text-sm uppercase tracking-wider"
      >
        <Dices />
        {t.randomize}
      </Button>
    </div>
  );
};
