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
