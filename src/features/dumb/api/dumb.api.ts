import { axios } from "../../../lib/axios";

export const getDumbPostAPI = () => {
  return axios.get("/posts");
};
