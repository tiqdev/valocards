import { translations } from "@/lib/i18n";
import { useCardStore } from "@/stores/card-store";

export const useTranslations = () =>
  translations[useCardStore((state) => state.config.lang)];
