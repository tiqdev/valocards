"use client";

import { ChevronDown, Dices, Download, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CARD_SIZE } from "@/components/card/player-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { useTranslations } from "@/hooks/use-translations";
import {
  DEFAULT_EXPORT_SCALE,
  randomizeCardConfig,
  serializeCardConfig,
  type ExportScale,
} from "@/lib/card/config";
import { useDownloadCard } from "@/queries/card";
import { useCardStore, useCardStoreApi } from "@/stores/card-store";

export const CardActions = () => {
  const store = useCardStoreApi();
  const layout = useCardStore((state) => state.config.layout);
  const { data: catalog } = useStudioCatalog();
  const download = useDownloadCard();
  const t = useTranslations();

  const handleDownload = (scale: ExportScale) => {
    const toastId = toast.loading(t.downloading);
    download.mutate(
      { config: store.getState().config, scale },
      {
        onSuccess: () => toast.success(t.downloaded, { id: toastId }),
        onError: () => toast.error(t.download_error, { id: toastId }),
      }
    );
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

  const size = CARD_SIZE[layout];
  const downloadOptions: { scale: ExportScale; label: string; hint: string }[] = [
    { scale: 2, label: t.download_hd, hint: t.download_hd_hint },
    { scale: 1, label: t.download_original, hint: t.download_original_hint },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="corner-cut flex">
        <Button
          size="lg"
          onClick={() => handleDownload(DEFAULT_EXPORT_SCALE)}
          disabled={download.isPending}
          className="rounded-none pr-4 pl-6 font-display text-sm font-bold uppercase tracking-widest"
        >
          {download.isPending ? <Loader2 className="animate-spin" /> : <Download />}
          {t.download_label}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              disabled={download.isPending}
              aria-label={t.download_options}
              className="rounded-none border-l border-primary-foreground/25 px-3"
            >
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="font-display uppercase tracking-wider">
              {t.download_options}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {downloadOptions.map((option) => (
              <DropdownMenuItem
                key={option.scale}
                onClick={() => handleDownload(option.scale)}
                className="flex-col items-start gap-0.5"
              >
                <span className="flex w-full items-center justify-between gap-2 font-medium">
                  {option.label}
                  <span className="font-display text-xs text-muted-foreground">
                    {size.width * option.scale}×{size.height * option.scale}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.hint}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
