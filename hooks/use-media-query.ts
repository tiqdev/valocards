import { useSyncExternalStore } from "react";

/** Sunucuda (ve ilk hydration'da) false döner; mobil öncelikli varsayım. */
export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );

export const DESKTOP_QUERY = "(min-width: 1024px)";
