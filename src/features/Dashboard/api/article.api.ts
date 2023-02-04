import { IAPIResponseInterface } from "@/interfaces";
import { axios } from "@/lib/axios";
import { TArticleFormValues } from "../components/Containers/CreateArticle/CreateArticle.container";

const articleURL = "articles";

export const APIfetchArticles = (
  subCatId: any
): Promise<IAPIResponseInterface> => {
  return axios.get(`${articleURL}/${subCatId}`);
};

export const APIcreateArticle = (
  article: TArticleFormValues,
  catId: string,
  subCatId: string,
  userId: string
): Promise<IAPIResponseInterface> => {
  const formData = new FormData();
  formData.append("file", article.image);
  formData.append("libelle", article.label);
  formData.append("prix_location", String(article.price));
  formData.append("qte_total", String(article.total_qte));
  formData.append("qte_disponible", String(article.available_qte));
  formData.append("qte_set", String(article.set));
  formData.append("utilisateurs_id", userId);
  formData.append("categories_id", catId);
  formData.append("sous_categories_id", subCatId);

  const config: Record<string, any> = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return axios.post(`${articleURL}`, formData, config);
};

export const APImodifyArticle = (
  article: TArticleFormValues,
  catId: string,
  subCatId: string,
  userId: string,
  articleId: string
): Promise<IAPIResponseInterface> => {
  const formData = new FormData();
  formData.append("file", article.image);
  formData.append("libelle", article.label);
  formData.append("prix_location", String(article.price));
  formData.append("qte_total", String(article.total_qte));
  formData.append("qte_disponible", String(article.available_qte));
  formData.append("qte_set", String(article.set));
  formData.append("utilisateurs_id", userId);
  formData.append("categories_id", catId);
  formData.append("sous_categories_id", subCatId);

  const config: Record<string, any> = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return axios.put(`${articleURL}/${articleId}`, formData, config);
};

export const APIdeleteArticle = (
  articleId: string
): Promise<IAPIResponseInterface> => {
  return axios.delete(`${articleURL}/${articleId}`);
};
