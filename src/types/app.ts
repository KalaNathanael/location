export type AuthUser = {
  is_actif: 0 | -1 | 1;
  username: string;
  email: string;
  nom: string;
  prenoms: string;
  id: string;
  date_created: Date;
  admin: 0 | 1;
};
