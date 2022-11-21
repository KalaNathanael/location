export type AuthUser = {
  email: string;
  noms: string;
  prenoms: string;
  id: number;
  created_at: string;
  telephone: string;
  profil_id: {
    id: number;
    libelle: "ADMINISTRATEUR" | "ASSISTANTE";
  };
};
