import { IAPIResponseInterface } from "@/interfaces";
import { axios } from "@/lib/axios";

export const APIfetchArticles = (
  subCatId: any
): Promise<IAPIResponseInterface> => {
  return axios.get(`articles/${subCatId}`);
};
