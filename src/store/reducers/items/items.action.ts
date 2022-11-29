import {
  APIcreateClient,
  APIfetchClients,
} from "@/features/Dashboard/api/client.api";
import { TRootState } from "@/store";
import { TReducerError } from "@/types";
import { TClient } from "@/types/client";
import { changeDateStringFormat } from "@/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getClientsListAction = createAsyncThunk<
  TClient[],
  undefined,
  {
    state: TRootState;
    rejectValue: TReducerError;
  }
>("clients/getList", async (param, { rejectWithValue, getState }) => {
  try {
    const response = await APIfetchClients();
    const datas: any[] = response.data;
    const toReturn: TClient[] = datas.map((elt) => ({
      id: elt.id,
      created_at: new Date(elt.created_at),
      email: elt.email,
      nom_prenom: elt.nom_prenom,
      telephone: elt.telephone,
    }));
    return toReturn;
  } catch (err: any) {
    let error: AxiosError<any> = err;
    let errorToSend: TReducerError = {
      message:
        "Oops, une erreur inattendu est survenue. Veuillez réessayer svp",
      value: error.response,
    };
    return rejectWithValue(errorToSend);
  }
});

export const createClientAction = createAsyncThunk<
  TClient,
  {
    completeName: string;
    email: string;
    number: string;
  },
  {
    state: TRootState;
    rejectValue: TReducerError;
  }
>("clients/create", async (param, { rejectWithValue, getState }) => {
  try {
    const response = await APIcreateClient(
      param.completeName,
      param.email,
      param.number
    );
    const data: any = response.data;
    const toReturn: TClient = {
      id: data.id,
      created_at: new Date(changeDateStringFormat(data.created_at)),
      email: data.email,
      nom_prenom: data.nom_prenom,
      telephone: data.telephone,
    };
    return toReturn;
  } catch (err: any) {
    let error: AxiosError<any> = err;
    let errorToSend: TReducerError = {
      message:
        "Oops, une erreur inattendu est survenue. Veuillez réessayer svp",
      value: error.response,
    };
    return rejectWithValue(errorToSend);
  }
});
