export type TUser = {
  noms: string;
  id: number;
  created_at: Date;
  prenoms: string;
  telephone: string;
  profil: {
    id: number;
    libelle: string;
  };
  email: string;
};
