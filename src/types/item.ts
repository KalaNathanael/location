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
  created_at?: Date;
  updated_at?: Date | null;
};

export type TTypeArticle = {
  libelle: string;
  img_path: string;
  qte_livree: number;
  qte_retour: number;
  categorie_libelle: {
    id: number;
    libelle: string;
    img_path: string;
  };
  sous_categorie: {
    id: number;
    libelle: string;
    img_path: string;
  };
};
