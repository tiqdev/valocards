import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const CARD_FONT_FAMILY = "Roboto Condensed";

// Yollar statik yazılır; böylece deploy paketine sadece bu dosyalar eklenir.
const FONT_REGULAR = join(process.cwd(), "assets/fonts/RobotoCondensed-Regular.ttf");
const FONT_MEDIUM = join(process.cwd(), "assets/fonts/RobotoCondensed-Medium.ttf");
const CARD_FRAME = join(process.cwd(), "public/card-frame.png");

let cardFonts:
  | Promise<
      { name: string; data: Buffer; weight: 400 | 500; style: "normal" }[]
    >
  | undefined;

// Fontlar repoda tutulur (assets/fonts, OFL lisanslı); böylece PNG üretimi
// dış bir servise bağımlı olmaz. Latin, Türkçe ve Kiril karakterleri içerir.
export const loadCardFonts = () => {
  cardFonts ??= Promise.all([
    readFile(FONT_REGULAR),
    readFile(FONT_MEDIUM),
  ]).then(([regular, medium]) => [
    { name: CARD_FONT_FAMILY, data: regular, weight: 400, style: "normal" },
    { name: CARD_FONT_FAMILY, data: medium, weight: 500, style: "normal" },
  ]);
  return cardFonts;
};

let cardFrame: Promise<string> | undefined;

export const loadCardFrame = () => {
  cardFrame ??= readFile(CARD_FRAME).then(
    (file) => `data:image/png;base64,${file.toString("base64")}`
  );
  return cardFrame;
};
