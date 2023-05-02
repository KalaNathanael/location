import { IAPIResponseInterface } from "@/interfaces";
import { axios } from "@/lib/axios";
import { TBasket, TEventDetails } from "@/store/reducers/items/items.reducer";
import { TTypeArticle } from "@/types";

export const APIfetchCommands = (): Promise<IAPIResponseInterface> => {
  return axios.get("commandes");
};

export const APIsaveCommand = (
  basket: TBasket,
  eventDetails: TEventDetails,
  connectedUserId: number
): Promise<IAPIResponseInterface> => {
  let toSend = {
    basket: basket,
    date: eventDetails.dateTime,
    client: {
      name: eventDetails.client.nom_prenom,
      id: eventDetails.client.id,
    },
    utilisateurs_id: connectedUserId,
  };

  return axios.post("commandes", toSend);
};

export const APIfetchDevis = (codeCommande: string): Promise<any> => {
  return axios.get(`get-devis/${codeCommande}`, { responseType: "blob" });
};

export const APIvalidateDevis = (
  codeCommande: string
): Promise<IAPIResponseInterface> => {
  return axios.put(`update-devis/${codeCommande}`, { statut: 1 });
};

export const APIcancelDevis = (
  codeCommande: string
): Promise<IAPIResponseInterface> => {
  return axios.put(`update-devis/${codeCommande}`, { statut: -1 });
};

export const APIdeliverDevis = (
  code: string
): Promise<IAPIResponseInterface> => {
  return axios.put(`/validation-devis/${code}`, { statut: 1 });
};

export const APIdetailDevis = (
  code: string
): Promise<IAPIResponseInterface> => {
  return axios.get(`/devis/${code}`);
};

export const APIcollectItems = (
  commandCode: string,
  datas: TTypeArticle[]
): Promise<IAPIResponseInterface> => {
  //TODO: On attend la route
  const toSend = {
    code: commandCode,
    articles: datas,
  };
  return axios.put(`route`, toSend);
};
