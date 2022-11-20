export type TCat = {
  id: any;
  label: string;
  image_url: string;
  description?: string;
  hasSubCat?: boolean;
};

export type TSubCat = {
  id: any;
  label: string;
  image_url: string;
  description?: string;
};

export type TArticle = {
  id: any;
  label: string;
  total_qte: number;
  available_qte: number;
  price: number;
  image_url?: string;
  set: number;
};
