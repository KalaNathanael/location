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
  id: any;
  label: string;
  total_qte: number;
  available_qte: number;
  price: number;
  image_url?: string;
  set: number;
  created_at?: Date;
  updated_at?: Date | null;
};

export type TTypeArticle = {
  id: any;
  libelle: string;
  img_path: string;
  qte_livree: number;
  qte_retour: number;
  qte_damaged: number;
  price: number;
  // categorie: {
  //   id: number;
  //   libelle: string;
  //   img_path: string;
  // };
  // sub_categorie: {
  //   id: number;
  //   libelle: string;
  //   img_path: string;
  // };
};
