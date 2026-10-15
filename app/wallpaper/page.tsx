import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { WallpaperStudio } from "@/components/wallpaper/wallpaper-studio";
import { getPreferredLanguage } from "@/lib/server/initial-config";
import { getWallpaperAssets } from "@/lib/server/wallpaper-assets";
import { wallpaperAssetsQueryKey } from "@/queries/wallpaper";

export const metadata: Metadata = {
  title: "Wallpaper | ValoCards",
  description:
    "Create your own Valorant phone or desktop wallpaper with agents, sprays and player cards.",
};

export default async function WallpaperPage() {
  const lang = await getPreferredLanguage();

  // Sprey ve haritalar sunucuda hazırlanır; katalog (ajan, kart) client'ta yüklenir.
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: wallpaperAssetsQueryKey(lang),
    queryFn: () => getWallpaperAssets(lang),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WallpaperStudio initialLang={lang} />
    </HydrationBoundary>
  );
}
