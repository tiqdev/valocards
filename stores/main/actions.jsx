import store from "..";
import { _setLoading } from ".";

export const setIsLoading = (isLoading) => {
  store.dispatch(_setLoading(isLoading));
};
