export type AuthUser = {
  email: string;
  noms: string;
  prenoms: string;
  id: string;
  created_at: string;
  telephone: string;
  profil_id: {
    id: number;
    libelle: "ADMINISTRATEUR" | "ASSISTANTE";
  };
};
