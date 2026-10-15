"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type Konva from "konva";
import {
  ArrowDown,
  ArrowUp,
  BringToFront,
  Copy,
  Download,
  Eraser,
  FlipHorizontal2,
  ImagePlus,
  Loader2,
  Monitor,
  Redo2,
  SendToBack,
  Smartphone,
  Trash2,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Stage } from "@/components/layout/stage";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslations } from "@/hooks/use-translations";
import { saveBlob } from "@/lib/download";
import { cn } from "@/lib/utils";
import { exportStage } from "@/lib/wallpaper/export";
import {
  CANVAS_PRESET_IDS,
  CANVAS_PRESETS,
  DEFAULT_PRESET_BY_ORIENTATION,
  isCanvasPresetId,
} from "@/lib/wallpaper/presets";
import { useWallpaperStore } from "@/stores/wallpaper-store";

// Konva tarayıcıya özel; sunucuda render edilmez.
const WallpaperCanvas = dynamic(
  () => import("@/components/wallpaper/wallpaper-canvas").then((mod) => mod.WallpaperCanvas),
  {
    ssr: false,
    loading: () => <div className="h-[70%] aspect-[9/16] animate-pulse rounded-sm bg-muted" />,
  }
);

const CanvasToolbar = () => {
  const presetId = useWallpaperStore((state) => state.presetId);
  const setPreset = useWallpaperStore((state) => state.setPreset);
  const t = useTranslations();
  const { orientation } = CANVAS_PRESETS[presetId];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={orientation}
        onValueChange={(value) => {
          if (value === "vertical" || value === "horizontal") {
            setPreset(DEFAULT_PRESET_BY_ORIENTATION[value]);
          }
        }}
        className="bg-card"
      >
        <ToggleGroupItem value="vertical" className="gap-1.5 px-3">
          <Smartphone />
          <span className="font-display text-xs uppercase tracking-wider">
            {t.vertical_label}
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem value="horizontal" className="gap-1.5 px-3">
          <Monitor />
          <span className="font-display text-xs uppercase tracking-wider">
            {t.horizontal_label}
          </span>
        </ToggleGroupItem>
      </ToggleGroup>

      <Select
        value={presetId}
        onValueChange={(value) => {
          if (isCanvasPresetId(value)) setPreset(value);
        }}
      >
        <SelectTrigger size="sm" aria-label={t.canvas_size} className="bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CANVAS_PRESET_IDS.filter(
            (id) => CANVAS_PRESETS[id].orientation === orientation
          ).map((id) => {
            const preset = CANVAS_PRESETS[id];
            return (
              <SelectItem key={id} value={id}>
                {t[preset.label]}
                <span className="font-display text-xs text-muted-foreground">
                  {preset.width}×{preset.height}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

interface Tool {
  label: string;
  shortcut?: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

const ToolButton = ({ label, shortcut, icon: Icon, onClick, disabled, destructive }: Tool) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    title={shortcut ? `${label} (${shortcut})` : label}
    aria-label={label}
    className={cn(
      "font-display text-xs uppercase tracking-wider",
      destructive && "text-destructive hover:text-destructive"
    )}
  >
    <Icon />
    <span className="hidden 2xl:inline">{label}</span>
  </Button>
);

const ToolDivider = () => <span aria-hidden className="mx-0.5 h-5 w-px bg-border" />;

/** Seçili öğenin araçları; seçim yokken yönlendirme metni (yükseklik sabit kalır). */
const SelectionToolbar = () => {
  const selectedId = useWallpaperStore((state) => state.selectedId);
  const layerIndex = useWallpaperStore((state) =>
    state.elements.findIndex((element) => element.id === state.selectedId)
  );
  const elementCount = useWallpaperStore((state) => state.elements.length);
  const moveElement = useWallpaperStore((state) => state.moveElement);
  const flipElement = useWallpaperStore((state) => state.flipElement);
  const duplicateElement = useWallpaperStore((state) => state.duplicateElement);
  const removeElement = useWallpaperStore((state) => state.removeElement);
  const t = useTranslations();

  if (!selectedId) {
    return (
      <p className="flex h-9 items-center text-xs text-muted-foreground">
        {elementCount > 0 ? t.selection_hint : t.autosave_hint}
      </p>
    );
  }

  const isFront = layerIndex === elementCount - 1;
  const isBack = layerIndex === 0;

  // Katman sırası: en arkadan en öne doğru.
  const layerTools: Tool[] = [
    { label: t.send_to_back, shortcut: "Ctrl+Shift+[", icon: SendToBack, onClick: () => moveElement(selectedId, "back"), disabled: isBack },
    { label: t.send_backward, shortcut: "Ctrl+[", icon: ArrowDown, onClick: () => moveElement(selectedId, "backward"), disabled: isBack },
    { label: t.bring_forward, shortcut: "Ctrl+]", icon: ArrowUp, onClick: () => moveElement(selectedId, "forward"), disabled: isFront },
    { label: t.bring_to_front, shortcut: "Ctrl+Shift+]", icon: BringToFront, onClick: () => moveElement(selectedId, "front"), disabled: isFront },
  ];
  const editTools: Tool[] = [
    { label: t.flip, icon: FlipHorizontal2, onClick: () => flipElement(selectedId) },
    { label: t.duplicate, shortcut: "Ctrl+D", icon: Copy, onClick: () => duplicateElement(selectedId) },
  ];

  return (
    <div className="flex h-9 items-center gap-0.5 rounded-md border bg-card p-0.5">
      {layerTools.map((tool) => (
        <ToolButton key={tool.label} {...tool} />
      ))}
      <ToolDivider />
      {editTools.map((tool) => (
        <ToolButton key={tool.label} {...tool} />
      ))}
      <ToolDivider />
      <ToolButton
        label={t.delete_item}
        shortcut="Delete"
        icon={Trash2}
        onClick={() => removeElement(selectedId)}
        destructive
      />
    </div>
  );
};

const EmptyState = () => {
  const setPanelOpen = useWallpaperStore((state) => state.setPanelOpen);
  const t = useTranslations();

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
      <div className="flex max-w-xs flex-col items-center gap-3 rounded-md bg-black/50 p-5 text-center text-white backdrop-blur-sm">
        <ImagePlus className="size-8 text-primary" />
        <p className="font-display text-lg font-bold uppercase tracking-widest">
          {t.empty_canvas_title}
        </p>
        <p className="text-sm text-white/80">{t.empty_canvas_hint}</p>
        <Button
          size="sm"
          onClick={() => setPanelOpen(true)}
          className="pointer-events-auto font-display uppercase tracking-wider"
        >
          <ImagePlus />
          {t.wallpaper_add}
        </Button>
      </div>
    </div>
  );
};

const WallpaperActions = ({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage | null>;
}) => {
  const presetId = useWallpaperStore((state) => state.presetId);
  const canUndo = useWallpaperStore((state) => state.past.length > 0);
  const canRedo = useWallpaperStore((state) => state.future.length > 0);
  const hasElements = useWallpaperStore((state) => state.elements.length > 0);
  const undo = useWallpaperStore((state) => state.undo);
  const redo = useWallpaperStore((state) => state.redo);
  const clear = useWallpaperStore((state) => state.clear);
  const [isExporting, setExporting] = useState(false);
  const t = useTranslations();

  const handleDownload = async () => {
    const stage = stageRef.current;
    if (!stage) return;

    const { width, height } = CANVAS_PRESETS[presetId];
    const toastId = toast.loading(t.downloading);
    setExporting(true);

    try {
      const blob = await exportStage(stage, width);
      saveBlob(blob, `valocards-wallpaper-${width}x${height}.png`);
      toast.success(t.wallpaper_downloaded, { id: toastId });
    } catch {
      toast.error(t.download_error, { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  const handleClear = () => {
    clear();
    toast(t.canvas_cleared, { action: { label: t.undo, onClick: undo } });
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="flex items-center gap-1 rounded-md border bg-card p-0.5">
        <Button variant="ghost" size="icon-sm" onClick={undo} disabled={!canUndo} title={t.undo} aria-label={t.undo}>
          <Undo2 />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={redo} disabled={!canRedo} title={t.redo} aria-label={t.redo}>
          <Redo2 />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={handleClear} disabled={!hasElements} title={t.clear_canvas} aria-label={t.clear_canvas}>
          <Eraser />
        </Button>
      </div>
      <Button
        size="lg"
        onClick={() => void handleDownload()}
        disabled={isExporting}
        className="corner-cut rounded-none px-6 font-display text-sm font-bold uppercase tracking-widest"
      >
        {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
        {t.download_label}
      </Button>
    </div>
  );
};

export const WallpaperStage = ({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage | null>;
}) => {
  const isPanelOpen = useWallpaperStore((state) => state.isPanelOpen);
  const setPanelOpen = useWallpaperStore((state) => state.setPanelOpen);
  const isEmpty = useWallpaperStore((state) => state.elements.length === 0);
  const t = useTranslations();

  return (
    <Stage
      label={t.wallpaper_canvas}
      panelOpen={isPanelOpen}
      onPanelOpenChange={setPanelOpen}
      openPanelLabel={t.wallpaper_add}
    >
      <CanvasToolbar />
      <div className="relative flex min-h-64 w-full flex-1 items-center justify-center lg:min-h-0">
        <WallpaperCanvas stageRef={stageRef} />
        {isEmpty && <EmptyState />}
      </div>
      <SelectionToolbar />
      <WallpaperActions stageRef={stageRef} />
    </Stage>
  );
};
