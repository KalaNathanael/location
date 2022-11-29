export type TUser = {
  noms: string;
  id: number;
  created_at: Date;
  prenoms: string;
  telephone?: string;
  profil: TProfil;
  email: string;
};

export type TProfil = {
  id: number;
  description?: string;
  libelle?: string;
  created_at?: Date;
};
