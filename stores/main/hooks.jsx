import { useSelector } from "react-redux";

export const useIsLoading = () => {
  return useSelector((state) => state.main.isLoading);
};
