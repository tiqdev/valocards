import axios from "axios";
import {
  cardImagePath,
  type CardConfig,
  type ExportScale,
} from "@/lib/card/config";
import type { LanguageCode } from "@/lib/i18n";
import type { Catalog } from "@/types/catalog";
import type { WallpaperAssets } from "@/types/wallpaper";

// Uygulamanın kendi API route'larına (app/api/*) istek atan istemci.
const api = axios.create({ baseURL: "/api" });

export const fetchCatalog = async (lang: LanguageCode) => {
  const { data } = await api.get<Catalog>("/catalog", { params: { lang } });
  return data;
};

export const fetchCardImage = async (
  config: CardConfig,
  scale: ExportScale
) => {
  const { data } = await axios.get<Blob>(cardImagePath(config, scale), {
    responseType: "blob",
  });
  return data;
};

export const fetchWallpaperAssets = async (lang: LanguageCode) => {
  const { data } = await api.get<WallpaperAssets>("/wallpaper-assets", {
    params: { lang },
  });
  return data;
};
