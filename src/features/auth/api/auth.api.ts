import { axios } from "@/lib/axios";
import { IUserAPIResponse } from "../interfaces";

export type LoginCredentialsDTO = {
  email: string;
  mot_passe: string;
};

export const authAPI = (
  data: LoginCredentialsDTO
): Promise<IUserAPIResponse> => {
  return axios.post("/login", data);
};
