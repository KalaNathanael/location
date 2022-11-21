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
  client: {
    id: number;
    nom_prenom: string;
  };
  created_at: Date;
};
