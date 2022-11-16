import { axios } from "@/lib/axios";
import { IUserAPIResponse } from "../interfaces";

export type LoginCredentialsDTO = {
  login: string;
  password: string;
};

export const APIauth = (
  data: LoginCredentialsDTO
): Promise<IUserAPIResponse> => {
  return axios.post("/login", data);
};
