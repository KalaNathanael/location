import { IAPIResponseInterface } from "@/interfaces";
import { axios } from "@/lib/axios";

export const APIfetchClients = (): Promise<IAPIResponseInterface> => {
  return axios.get("clients");
};

export const APIcreateClient = (
  completeName: string,
  email: string,
  number: string
): Promise<IAPIResponseInterface> => {
  const toSend = {
    nom_prenom: completeName,
    email: email,
    telephone: number,
  };
  return axios.post("clients", toSend);
};
