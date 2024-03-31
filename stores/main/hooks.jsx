import { useSelector } from "react-redux";

export const useIsLoading = () => {
  return useSelector((state) => state.main.isLoading);
};

export const useSelectedLanguage = () => {
  return useSelector((state) => state.main.selectedLanguage);
};

export const useLanguages = () => {
  return useSelector((state) => state.main.languages);
};

export const useCardPreview = () => {
  return useSelector((state) => state.main.cardPreview);
};

export const useFormData = () => {
  return useSelector((state) => state.main.formData);
};

export const useTitles = () => {
  return useSelector((state) => state.main.titles);
};

export const usePlayerCards = () => {
  return useSelector((state) => state.main.playerCards);
};

export const useAgents = () => {
  return useSelector((state) => state.main.agents);
};

export const useTiers = () => {
  return useSelector((state) => state.main.tiers);
};

export const useSheetOpen = () => {
  return useSelector((state) => state.main.isSheetOpen);
};

export const useIsPng = () => {
  return useSelector((state) => state.main.isPng);
};

export const useTranslations = () => {
  let _translations = useSelector((state) => {
    let selectedLanguage = state.main.selectedLanguage;
    let translations = state.main.translations;

    let translationValue = Object.keys(translations).find(
      (key) => key === selectedLanguage.value
    );

    if (translationValue) {
      return translations[translationValue];
    } else {
      return null; // or handle the case when the key is not found
    }
  });

  return _translations;
};
