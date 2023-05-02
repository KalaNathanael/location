import { TClient } from "./client";
import { TTypeArticle } from "./item";

export type TStatus = {
  label: string;
  color: string;
};

export type TCommand = {
  id: number;
  dateDebut: Date;
  dateFin: Date;
  statusCommande: TStatus;
  codeCommande: string;
  statusDevis: TStatus;
  montantDevis: number;
  client: TClient;
  commandArticles?: TTypeArticle[];
  created_at: Date;
};
