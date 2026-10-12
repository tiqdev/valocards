import "server-only";

import { cookies, headers } from "next/headers";
import { parseCardConfig } from "@/lib/card/config";
import {
  defaultLanguage,
  isLanguageCode,
  LANGUAGE_COOKIE,
  matchLanguage,
} from "@/lib/i18n";

export type SearchParams = Record<string, string | string[] | undefined>;

/** Kullanıcının dili: çerez > tarayıcı dili > varsayılan. */
export const getPreferredLanguage = async () => {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
  const cookieLang = cookieStore.get(LANGUAGE_COOKIE)?.value;

  return (
    (cookieLang && isLanguageCode(cookieLang) ? cookieLang : undefined) ??
    matchLanguage(headerList.get("accept-language")) ??
    defaultLanguage
  );
};

/** Kart ayarları URL'den okunur; URL'de dil yoksa kullanıcının dili kullanılır. */
export const getInitialCardConfig = async (searchParams: SearchParams) =>
  parseCardConfig(searchParams, await getPreferredLanguage());
