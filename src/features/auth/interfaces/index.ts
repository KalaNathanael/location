import { IAPIResponseInterface } from "@/interfaces";
import { AuthUser } from "@/types/app";

// type UserDataResponse = {
//   token: string;
// };

export interface IUserAPIResponse extends IAPIResponseInterface {
  data: AuthUser;
}
