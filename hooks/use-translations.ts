import { useLanguage } from "@/components/i18n-provider";
import { translations } from "@/lib/i18n";

export const useTranslations = () => translations[useLanguage().lang];
