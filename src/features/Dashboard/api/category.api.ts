import { IAPIResponseInterface } from "@/interfaces";
import { axios } from "@/lib/axios";

const categoryURL = "categories";
const subCategoryURL = "sous-categories";

export const APIfetchCategories = (): Promise<IAPIResponseInterface> => {
  return axios.get(categoryURL);
};

export const APIaddCategories = (
  userId: string,
  libelle: string,
  file: File
): Promise<IAPIResponseInterface> => {
  const formData = new FormData();
  formData.append("libelle", libelle);
  formData.append("utilisateurs_id", userId);
  formData.append("file", file);

  const config: Record<string, any> = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return axios.post(categoryURL, formData, config);
};

export const APImodifyCategories = (
  userId: string,
  libelle: string,
  file: File
): Promise<IAPIResponseInterface> => {
  const formData = new FormData();
  formData.append("libelle", libelle);
  formData.append("utilisateurs_id", userId);
  formData.append("file", file);

  const config: Record<string, any> = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return axios.put(categoryURL, formData, config);
};

export const APIfetchSubCategories = (): Promise<IAPIResponseInterface> => {
  return axios.get(subCategoryURL);
};

export const APIaddSubCategories = (
  userId: string,
  libelle: string,
  file: File,
  categoryId: string
): Promise<IAPIResponseInterface> => {
  const formData = new FormData();
  formData.append("libelle", libelle);
  formData.append("categories_id", categoryId);
  formData.append("utilisateurs_id", userId);
  formData.append("file", file);

  const config: Record<string, any> = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return axios.post(subCategoryURL, formData, config);
};

export const APImodifySubCategories = (
  userId: string,
  libelle: string,
  file: File,
  categoryId: string
): Promise<IAPIResponseInterface> => {
  const formData = new FormData();
  formData.append("libelle", libelle);
  formData.append("utilisateurs_id", userId);
  formData.append("categories_id", categoryId);
  formData.append("file", file);

  const config: Record<string, any> = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  return axios.put(subCategoryURL, formData, config);
};
