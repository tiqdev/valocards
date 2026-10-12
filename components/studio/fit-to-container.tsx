"use client";

import { useEffect, useRef, useState } from "react";

/** İçeriği oranını koruyarak kapsayıcıya sığacak şekilde ölçekler. */
export const FitToContainer = ({
  width,
  height,
  maxScale = 1,
  children,
}: {
  width: number;
  height: number;
  maxScale?: number;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width: availableWidth, height: availableHeight } =
        entry.contentRect;
      setScale(
        Math.min(availableWidth / width, availableHeight / height, maxScale)
      );
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [width, height, maxScale]);

  const appliedScale = scale ?? 1;

  return (
    <div
      ref={ref}
      className="flex size-full min-h-0 items-center justify-center"
    >
      <div
        style={{
          width: width * appliedScale,
          height: height * appliedScale,
          // Ölçü alınana kadar gizli tut; ilk karede yanlış boyut görünmesin.
          opacity: scale === null ? 0 : 1,
        }}
      >
        <div
          style={{
            width,
            height,
            transform: `scale(${appliedScale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
