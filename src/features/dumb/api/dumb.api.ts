import { axios } from "../../../lib/axios";

export const getDumbPostAPI = (userId: number) => {
  return axios.get(`/posts?userId=${userId}`);
};
