import { IAPIResponseInterface } from "@/interfaces";
import { axios } from "@/lib/axios";
import { TBasket, TEventDetails } from "@/store/reducers/items/items.reducer";

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
