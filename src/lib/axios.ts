import Axios from "axios";
import { API_URL } from "../config";

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status > 400){
      const message = error.response?.data?.message || error.message;
  
      //console.log(message);
    }

    return Promise.reject(error);
  }
);
