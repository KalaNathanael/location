import { TStatus } from "@/types/command";

export const API_URL = process.env.REACT_APP_API_URL as string;
export const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const FILE_SIZE = 5 * 1024 * 1024;

export const commandStatus: { [key: string]: TStatus } = {
  "En attente": {
    label: "En attente",
    color: "var(--ui-yellow-normal)",
  },
  "A livrer": {
    label: "À livrer",
    color: "var(--ui-orange-normal)",
  },
  "A récupérer": {
    label: "À récupérer",
    color: "var(--ui-orange-normal)",
  },
  Terminé: {
    label: "Terminé",
    color: "var(--ui-green-dark)",
  },
};

export const devisStatus: { [key: string]: TStatus } = {
  "A régler": {
    label: "À régler",
    color: "var(--ui-red-normal)",
  },
  Réglé: {
    label: "Réglé",
    color: "var(--ui-green-dark)",
  },
};

export const defaultProfils = {
  1: {
    id: 1,
    libelle: "ASSISTANTE",
  },
  2: {
    id: 2,
    libelle: "ADMINISTRATEUR",
  },
};
