"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { LANGUAGE_COOKIE, type LanguageCode } from "@/lib/i18n";

interface I18nContextValue {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Sayfanın dilini sağlar. Dilin nerede tutulduğu sayfaya göre değişir
 * (kart sayfasında URL ile senkron store, duvar kağıdı sayfasında yerel
 * state); çeviriler, katalog ve dil seçici bu context'i kullanır.
 */
export const I18nProvider = ({
  lang,
  onLangChange,
  children,
}: {
  lang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    document.documentElement.lang = lang.slice(0, 2);
  }, [lang]);

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang: (next) => {
        // Tercih çerezde saklanır; sonraki ziyaretlerde sunucu bu dili kullanır.
        document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
        onLangChange(next);
      },
    }),
    [lang, onLangChange]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useLanguage must be used within I18nProvider");
  }
  return context;
};
