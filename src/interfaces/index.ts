import { AxiosResponse } from "axios";

export interface IAPIResponseInterface extends AxiosResponse {
  data: any | null;
  error: boolean;
  message: string;
}
export interface IAutoCompleteList {
  label: string;
  id?: string | number;
}
