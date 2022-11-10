export type TCat = {
  id: string;
  label: string;
  image_url: string;
  description?: string;
  hasSubCat?: boolean;
};

export type TSubCat = {
  id: string;
  label: string;
  image_url: string;
  description?: string;
};

export type TArticle = {
  id: string;
  label: string;
  total_qte: number;
  available_qte: number;
  price: number;
  image_url?: string;
};
