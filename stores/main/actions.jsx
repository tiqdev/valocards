import store from "..";
import {
  _getAgents,
  _getPlayerCards,
  _getTiers,
  _getTitles,
  _setCardPreview,
  _setFormData,
  _setLanguages,
  _setLoading,
  _setSelectedLanguage,
  _setSheetOpen,
} from ".";

export const setIsLoading = (isLoading) => {
  store.dispatch(_setLoading(isLoading));
};

export const setSelectedLanguage = (language) => {
  store.dispatch(_setSelectedLanguage(language));
};

export const setLanguages = (languages) => {
  store.dispatch(_setLanguages(languages));
};

export const setCardPreview = (cardPreview) => {
  store.dispatch(_setCardPreview(cardPreview));
};

export const setFormData = (formData) => {
  store.dispatch(_setFormData(formData));
};

export const getTitles = async () => {
  store.dispatch(_getTitles());
};

export const getPlayerCards = async () => {
  store.dispatch(_getPlayerCards());
};

export const getAgents = async () => {
  store.dispatch(_getAgents());
};

export const getTiers = async () => {
  store.dispatch(_getTiers());
};

export const setSheetOpen = (isOpen) => {
  store.dispatch(_setSheetOpen(isOpen));
};
