import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { CARD_SIZE, PlayerCard } from "@/components/card/player-card";
import { parseCardConfig } from "@/lib/card/config";
import { resolveCardData } from "@/lib/card/resolve";
import {
  CARD_FONT_FAMILY,
  loadCardFonts,
  loadCardFrame,
} from "@/lib/server/card-assets";
import { getCatalog } from "@/lib/server/catalog";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const config = parseCardConfig(searchParams);
  const scale = searchParams.get("scale") === "1" ? 1 : 2;

  const catalog = await getCatalog(config.lang);
  const data = resolveCardData(config, catalog);
  const size = CARD_SIZE[data.layout];

  const [frameSrc, fonts] = await Promise.all([
    loadCardFrame(),
    loadCardFonts(),
  ]);

  return new ImageResponse(
    (
      <PlayerCard
        data={data}
        frameSrc={frameSrc}
        fontFamily={CARD_FONT_FAMILY}
        scale={scale}
      />
    ),
    {
      width: size.width * scale,
      height: size.height * scale,
      fonts,
      headers: {
        "Cache-Control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
