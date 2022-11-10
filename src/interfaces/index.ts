import { AxiosResponse } from "axios";

export interface IAPIResponseInterface extends AxiosResponse {
  data: any | null;
  error: boolean;
  message: string;
}
