import { IAPIResponseInterface } from "@/interfaces";
import { axios } from "@/lib/axios";
import { TUserValues } from "../components/Containers/CreateUser/CreateUser.container";

export const APIfetchUsers = (): Promise<IAPIResponseInterface> => {
  return axios.get("accounts");
};

export const APIcreateUser = (
  userdatas: TUserValues
): Promise<IAPIResponseInterface> => {
  const toSend = {
    noms: userdatas.lastName,
    prenoms: userdatas.firstName,
    email: userdatas.email,
    telephone: userdatas.telephone,
    profil_id: userdatas.profil,
  };
  return axios.post("accounts", toSend);
};

export const APIfetchProfils = (): Promise<IAPIResponseInterface> => {
  return axios.get("profil");
};
