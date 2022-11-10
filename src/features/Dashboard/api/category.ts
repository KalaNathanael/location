import { IAPIResponseInterface } from "@/interfaces";
import { axios } from "@/lib/axios";

export const APIfetchCategories = (): Promise<IAPIResponseInterface> => {
  return axios.get("categories");
};

export const APIfetchSubCategories = (): Promise<IAPIResponseInterface> => {
  return axios.get("sous-categories");
};
