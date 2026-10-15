import type { Translations } from "@/lib/i18n";

export type CanvasOrientation = "vertical" | "horizontal";

export interface CanvasPreset {
  orientation: CanvasOrientation;
  width: number;
  height: number;
  label: keyof Translations;
}

/** Çıktı çözünürlükleri; tuvaldeki tüm koordinatlar bu piksel uzayındadır. */
export const CANVAS_PRESETS = {
  phone: { orientation: "vertical", width: 1080, height: 1920, label: "preset_phone" },
  "phone-tall": { orientation: "vertical", width: 1179, height: 2556, label: "preset_phone_tall" },
  desktop: { orientation: "horizontal", width: 1920, height: 1080, label: "preset_desktop" },
  "desktop-qhd": { orientation: "horizontal", width: 2560, height: 1440, label: "preset_desktop_qhd" },
} as const satisfies Record<string, CanvasPreset>;

export type CanvasPresetId = keyof typeof CANVAS_PRESETS;

export const CANVAS_PRESET_IDS = Object.keys(CANVAS_PRESETS) as CanvasPresetId[];

export const DEFAULT_PRESET_BY_ORIENTATION: Record<CanvasOrientation, CanvasPresetId> = {
  vertical: "phone",
  horizontal: "desktop",
};

export const isCanvasPresetId = (value: string): value is CanvasPresetId =>
  value in CANVAS_PRESETS;
