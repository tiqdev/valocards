import { NextResponse, type NextRequest } from "next/server";
import { isLanguageCode } from "@/lib/i18n";
import { getWallpaperAssets } from "@/lib/server/wallpaper-assets";

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang");

  if (!lang || !isLanguageCode(lang)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const assets = await getWallpaperAssets(lang);

  return NextResponse.json(assets, {
    headers: {
      "Cache-Control":
        "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
