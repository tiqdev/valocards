import { NextResponse, type NextRequest } from "next/server";
import { isLanguageCode } from "@/lib/i18n";
import { getCatalog } from "@/lib/server/catalog";

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang");

  if (!lang || !isLanguageCode(lang)) {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  const catalog = await getCatalog(lang);

  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
