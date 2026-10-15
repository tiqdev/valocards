"use client";

// Konva tarayıcıya özeldir; bu bileşen next/dynamic ile { ssr: false } yüklenir.

import { useEffect, useRef, useState } from "react";
import type Konva from "konva";
import {
  Image as KonvaImage,
  Layer,
  Rect,
  Stage,
  Transformer,
} from "react-konva";
import { CANVAS_PRESETS } from "@/lib/wallpaper/presets";
import { useLoadedImage } from "@/lib/wallpaper/image";
import {
  useWallpaperStore,
  type WallpaperElement,
} from "@/stores/wallpaper-store";

const MIN_ELEMENT_SIZE = 24;
const NUDGE = 10;

/** Görseli kutuyu tamamen dolduracak şekilde ortadan kırpar (CSS object-fit: cover). */
const coverCrop = (image: HTMLImageElement, width: number, height: number) => {
  const scale = Math.max(width / image.width, height / image.height);
  const cropWidth = width / scale;
  const cropHeight = height / scale;
  return {
    x: (image.width - cropWidth) / 2,
    y: (image.height - cropHeight) / 2,
    width: cropWidth,
    height: cropHeight,
  };
};

const ElementNode = ({
  element,
  registerNode,
  onSelect,
}: {
  element: WallpaperElement;
  registerNode: (id: string, node: Konva.Image | null) => void;
  onSelect: (id: string) => void;
}) => {
  const image = useLoadedImage(element.src);
  const updateElement = useWallpaperStore((state) => state.updateElement);
  const flip = element.flipX ? -1 : 1;

  return (
    <KonvaImage
      ref={(node) => registerNode(element.id, node)}
      image={image ?? undefined}
      crop={element.crop}
      // Konum merkezdir: döndürme ve aynalama merkez etrafında yapılır.
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      offsetX={element.width / 2}
      offsetY={element.height / 2}
      rotation={element.rotation}
      scaleX={flip}
      draggable
      onMouseDown={() => onSelect(element.id)}
      onTouchStart={() => onSelect(element.id)}
      onDragEnd={(event) =>
        updateElement(element.id, { x: event.target.x(), y: event.target.y() })
      }
      onTransformEnd={(event) => {
        // Transformer ölçeği değiştirir; ölçek boyuta işlenip sıfırlanır.
        const node = event.target;
        const width = Math.max(MIN_ELEMENT_SIZE, element.width * Math.abs(node.scaleX()));
        const height = Math.max(MIN_ELEMENT_SIZE, element.height * Math.abs(node.scaleY()));
        node.scaleX(flip);
        node.scaleY(1);
        updateElement(element.id, {
          x: node.x(),
          y: node.y(),
          width,
          height,
          rotation: node.rotation(),
        });
      }}
      onMouseEnter={(event) => {
        const container = event.target.getStage()?.container();
        if (container) container.style.cursor = "move";
      }}
      onMouseLeave={(event) => {
        const container = event.target.getStage()?.container();
        if (container) container.style.cursor = "default";
      }}
    />
  );
};

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** Klavye: Sil, Esc, Ctrl+Z / Ctrl+Shift+Z (Ctrl+Y), Ctrl+D, Ctrl+[ / Ctrl+] (Shift: en arkaya / en öne), ok tuşları. */
const useKeyboardShortcuts = () => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      const state = useWallpaperStore.getState();
      const selected = state.elements.find((element) => element.id === state.selectedId);
      const mod = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      if (mod && key === "z") {
        event.preventDefault();
        if (event.shiftKey) state.redo();
        else state.undo();
        return;
      }
      if (mod && key === "y") {
        event.preventDefault();
        state.redo();
        return;
      }
      if (!selected) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        state.removeElement(selected.id);
      } else if (event.key === "Escape") {
        state.select(null);
      } else if (mod && key === "d") {
        event.preventDefault();
        state.duplicateElement(selected.id);
      } else if (mod && (event.code === "BracketRight" || event.code === "BracketLeft")) {
        // Fiziksel tuş konumu kullanılır; [ ve ] klavye düzenine göre farklı yerlerde.
        event.preventDefault();
        const forward = event.code === "BracketRight";
        state.moveElement(
          selected.id,
          event.shiftKey ? (forward ? "front" : "back") : forward ? "forward" : "backward"
        );
      } else if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        const step = event.shiftKey ? NUDGE * 5 : NUDGE;
        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
        const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
        state.updateElement(selected.id, { x: selected.x + dx, y: selected.y + dy });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
};

export const WallpaperCanvas = ({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage | null>;
}) => {
  const presetId = useWallpaperStore((state) => state.presetId);
  const background = useWallpaperStore((state) => state.background);
  const elements = useWallpaperStore((state) => state.elements);
  const selectedId = useWallpaperStore((state) => state.selectedId);
  const select = useWallpaperStore((state) => state.select);
  const preset = CANVAS_PRESETS[presetId];
  const mapImage = useLoadedImage(background.mapSrc);

  // Tuval, çıktı çözünürlüğünde tasarlanır ve ekrana sığacak şekilde ölçeklenir.
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / preset.width, height / preset.height));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [preset.width, preset.height]);

  // Dokunmatik ekranlarda tutamaçlar daha büyük.
  const [isTouch] = useState(() => window.matchMedia("(pointer: coarse)").matches);

  const nodes = useRef(new Map<string, Konva.Image>());
  const registerNode = (id: string, node: Konva.Image | null) => {
    if (node) nodes.current.set(id, node);
    else nodes.current.delete(id);
  };

  const transformerRef = useRef<Konva.Transformer>(null);
  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;
    const node = selectedId ? nodes.current.get(selectedId) : undefined;
    transformer.nodes(node ? [node] : []);
    transformer.getLayer()?.batchDraw();
  }, [selectedId, elements, scale]);

  useKeyboardShortcuts();

  const deselectOnEmpty = (event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (event.target === event.target.getStage() || event.target.name() === "background") {
      select(null);
    }
  };

  return (
    <div ref={containerRef} className="flex size-full min-h-0 items-center justify-center">
      {scale !== null && (
        <div
          className="overflow-hidden rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-1 ring-border"
          // Sahnede sürüklerken sayfa kaydırılmasın.
          style={{ touchAction: "none" }}
        >
          <Stage
            ref={stageRef}
            width={preset.width * scale}
            height={preset.height * scale}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={deselectOnEmpty}
            onTouchStart={deselectOnEmpty}
          >
            <Layer>
              <Rect
                name="background"
                width={preset.width}
                height={preset.height}
                fill={background.color}
              />
              {mapImage && (
                <>
                  <KonvaImage
                    image={mapImage}
                    width={preset.width}
                    height={preset.height}
                    crop={coverCrop(mapImage, preset.width, preset.height)}
                    listening={false}
                  />
                  <Rect
                    width={preset.width}
                    height={preset.height}
                    fill="#000000"
                    opacity={background.dim}
                    listening={false}
                  />
                </>
              )}
            </Layer>

            <Layer>
              {elements.map((element) => (
                <ElementNode
                  key={element.id}
                  element={element}
                  registerNode={registerNode}
                  onSelect={select}
                />
              ))}
              <Transformer
                ref={transformerRef}
                keepRatio
                flipEnabled={false}
                enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                rotationSnapTolerance={4}
                anchorSize={isTouch ? 20 : 11}
                anchorCornerRadius={3}
                anchorStroke="#ff4655"
                anchorFill="#ffffff"
                borderStroke="#ff4655"
                borderStrokeWidth={1.5}
                rotateAnchorOffset={isTouch ? 36 : 26}
                ignoreStroke
                boundBoxFunc={(oldBox, newBox) =>
                  Math.abs(newBox.width) < MIN_ELEMENT_SIZE * (scale ?? 1) ||
                  Math.abs(newBox.height) < MIN_ELEMENT_SIZE * (scale ?? 1)
                    ? oldBox
                    : newBox
                }
              />
            </Layer>
          </Stage>
        </div>
      )}
    </div>
  );
};
