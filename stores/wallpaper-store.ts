import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ImageCrop } from "@/lib/wallpaper/image";
import {
  CANVAS_PRESETS,
  type CanvasPresetId,
} from "@/lib/wallpaper/presets";

export type WallpaperElementKind = "agent" | "spray" | "card";

export type LayerMove = "forward" | "backward" | "front" | "back";

/** Tuvaldeki bir görsel. Konum öğenin merkezidir; ölçüler çıktı pikselidir. */
export interface WallpaperElement {
  id: string;
  kind: WallpaperElementKind;
  src: string;
  /** Görselin kullanılan bölümü (şeffaf kenarlar kırpılmış); yoksa tamamı. */
  crop?: ImageCrop;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipX: boolean;
}

export interface WallpaperBackground {
  color: string;
  /** Rengin üstüne "cover" olarak yerleşen harita görseli. */
  mapId: string | null;
  mapSrc: string | null;
  /** Harita görselinin üstüne binen karartma (0–0.8). */
  dim: number;
}

interface WallpaperDesign {
  presetId: CanvasPresetId;
  background: WallpaperBackground;
  elements: WallpaperElement[];
}

interface WallpaperState extends WallpaperDesign {
  selectedId: string | null;
  isPanelOpen: boolean;
  past: WallpaperDesign[];
  future: WallpaperDesign[];

  /** crop verilirse öğenin oranı ve boyutu kırpılmış bölgeye göre belirlenir. */
  addElement: (kind: WallpaperElementKind, src: string, crop: ImageCrop) => void;
  /** Sürükleme veya dönüştürme bittiğinde çağrılır; geçmişe tek adım ekler. */
  updateElement: (id: string, patch: Partial<WallpaperElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  /** Katman sırası: bir adım öne/arkaya veya en öne/en arkaya. */
  moveElement: (id: string, direction: LayerMove) => void;
  flipElement: (id: string) => void;
  select: (id: string | null) => void;
  setPreset: (presetId: CanvasPresetId) => void;
  /**
   * transient: geçmişe eklemeden uygular (slider ve renk seçici sürüklenirken).
   * Bu durumda sürükleme başında checkpoint() çağrılır.
   */
  setBackground: (
    patch: Partial<WallpaperBackground>,
    options?: { transient?: boolean }
  ) => void;
  /** Mevcut tasarımı geçmişe ekler; ardından gelen geçici değişiklikler tek adımda geri alınır. */
  checkpoint: () => void;
  clear: () => void;
  undo: () => void;
  redo: () => void;
  setPanelOpen: (open: boolean) => void;
}

const HISTORY_LIMIT = 50;

const INITIAL_DESIGN: WallpaperDesign = {
  presetId: "phone",
  background: { color: "#0f1923", mapId: null, mapSrc: null, dim: 0.3 },
  elements: [],
};

const snapshot = ({ presetId, background, elements }: WallpaperDesign): WallpaperDesign => ({
  presetId,
  background,
  elements,
});

/** Mevcut tasarımı geçmişe ekleyip değişikliği uygular (geri alınabilir adım). */
const withHistory = (
  state: WallpaperState,
  patch: Partial<WallpaperDesign> & Partial<Pick<WallpaperState, "selectedId">>
) => ({
  ...patch,
  past: [...state.past, snapshot(state)].slice(-HISTORY_LIMIT),
  future: [],
});

/** Yeni öğenin tuvaldeki ilk boyutu: türüne göre tuvalin bir oranına sığdırılır. */
const initialSize = (
  kind: WallpaperElementKind,
  natural: { width: number; height: number },
  canvas: { width: number; height: number }
) => {
  const box =
    kind === "agent"
      ? { width: canvas.width * 0.9, height: canvas.height * 0.8 }
      : kind === "spray"
        ? {
            width: Math.min(canvas.width, canvas.height) * 0.35,
            height: Math.min(canvas.width, canvas.height) * 0.35,
          }
        : { width: canvas.width * 0.6, height: canvas.height * 0.55 };

  const scale = Math.min(box.width / natural.width, box.height / natural.height);
  return { width: natural.width * scale, height: natural.height * scale };
};

const newId = () => crypto.randomUUID();

export const useWallpaperStore = create<WallpaperState>()(
  persist(
    (set) => ({
      ...INITIAL_DESIGN,
      selectedId: null,
      isPanelOpen: false,
      past: [],
      future: [],

      addElement: (kind, src, crop) =>
        set((state) => {
          const canvas = CANVAS_PRESETS[state.presetId];
          // Üst üste eklenenler tam aynı yere düşmesin diye hafif kaydırılır.
          const jitter = () => (Math.random() - 0.5) * 0.08;
          const element: WallpaperElement = {
            id: newId(),
            kind,
            src,
            crop,
            x: canvas.width * (0.5 + jitter()),
            y: canvas.height * (0.5 + jitter()),
            rotation: 0,
            flipX: false,
            ...initialSize(kind, crop, canvas),
          };
          return withHistory(state, {
            elements: [...state.elements, element],
            selectedId: element.id,
          });
        }),

      updateElement: (id, patch) =>
        set((state) =>
          withHistory(state, {
            elements: state.elements.map((element) =>
              element.id === id ? { ...element, ...patch } : element
            ),
          })
        ),

      removeElement: (id) =>
        set((state) =>
          withHistory(state, {
            elements: state.elements.filter((element) => element.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId,
          })
        ),

      duplicateElement: (id) =>
        set((state) => {
          const source = state.elements.find((element) => element.id === id);
          if (!source) return state;

          const offset = Math.min(source.width, source.height) * 0.08;
          const copy = { ...source, id: newId(), x: source.x + offset, y: source.y + offset };
          return withHistory(state, {
            elements: [...state.elements, copy],
            selectedId: copy.id,
          });
        }),

      moveElement: (id, direction) =>
        set((state) => {
          const index = state.elements.findIndex((element) => element.id === id);
          const last = state.elements.length - 1;
          const target = {
            forward: index + 1,
            backward: index - 1,
            front: last,
            back: 0,
          }[direction];
          if (index < 0 || target < 0 || target > last || target === index) return state;

          // Dizideki sıra çizim sırasıdır: sondaki öğe en öndedir.
          const elements = [...state.elements];
          const [element] = elements.splice(index, 1);
          elements.splice(target, 0, element!);
          return withHistory(state, { elements });
        }),

      flipElement: (id) =>
        set((state) =>
          withHistory(state, {
            elements: state.elements.map((element) =>
              element.id === id ? { ...element, flipX: !element.flipX } : element
            ),
          })
        ),

      select: (selectedId) => set({ selectedId }),

      setPreset: (presetId) =>
        set((state) => {
          if (presetId === state.presetId) return state;

          // Öğeler yeni tuvale orantılı taşınır ve sığacak şekilde ölçeklenir.
          const from = CANVAS_PRESETS[state.presetId];
          const to = CANVAS_PRESETS[presetId];
          const sx = to.width / from.width;
          const sy = to.height / from.height;
          const size = Math.min(sx, sy);

          return withHistory(state, {
            presetId,
            elements: state.elements.map((element) => ({
              ...element,
              x: element.x * sx,
              y: element.y * sy,
              width: element.width * size,
              height: element.height * size,
            })),
          });
        }),

      setBackground: (patch, options) =>
        set((state) => {
          const background = { ...state.background, ...patch };
          return options?.transient ? { background } : withHistory(state, { background });
        }),

      checkpoint: () => set((state) => withHistory(state, {})),

      clear: () =>
        set((state) =>
          withHistory(state, { elements: [], selectedId: null })
        ),

      undo: () =>
        set((state) => {
          const previous = state.past.at(-1);
          if (!previous) return state;
          return {
            ...previous,
            past: state.past.slice(0, -1),
            future: [snapshot(state), ...state.future],
            selectedId: null,
          };
        }),

      redo: () =>
        set((state) => {
          const next = state.future[0];
          if (!next) return state;
          return {
            ...next,
            past: [...state.past, snapshot(state)],
            future: state.future.slice(1),
            selectedId: null,
          };
        }),

      setPanelOpen: (isPanelOpen) => set({ isPanelOpen }),
    }),
    {
      name: "valocards-wallpaper",
      version: 1,
      // Kayıtlı tasarım yüklenmeden yapılan yazmalar (örn. masaüstünde panelin
      // açılması) localStorage'daki tasarımı varsayılan değerlerle ezmesin.
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          if (useWallpaperStore.persist.hasHydrated()) {
            localStorage.setItem(name, value);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
      // Sadece tasarım saklanır; seçim, panel ve geçmiş oturuma özeldir.
      partialize: ({ presetId, background, elements }) => ({
        presetId,
        background,
        elements,
      }),
      // localStorage sunucuda yok; tasarım client'ta mount sonrası yüklenir.
      skipHydration: true,
    }
  )
);
