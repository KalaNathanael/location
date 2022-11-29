import { defaultProfils } from "@/config";
import { APIcreateUser, APIfetchUsers } from "@/features/Dashboard/api/admin";
import { TUserValues } from "@/features/Dashboard/components/Conainers/CreateUser/CreateUser.container";
import { TRootState } from "@/store";
import { TReducerError } from "@/types";
import { TUser } from "@/types/user";
import { changeDateStringFormat } from "@/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const fetchUsersAction = createAsyncThunk<
  TUser[],
  undefined,
  {
    state: TRootState;
    rejectValue: TReducerError;
  }
>("clients/getList", async (param, { rejectWithValue, getState }) => {
  try {
    const response = await APIfetchUsers();
    if (response.error) {
      throw Error(response.message);
    } else {
      const data: any[] = response.data;
      const toReturn: TUser[] = data.map((elt) => {
        return {
          id: elt.id,
          email: elt.email,
          created_at: new Date(changeDateStringFormat(elt.created_at)),
          noms: elt.noms,
          prenoms: elt.prenoms,
          profil: {
            id: elt.profil_id.id,
            libelle: elt.profil_id.libelle,
          },
        };
      });
      return toReturn;
    }
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

export const createUserAction = createAsyncThunk<
  TUser,
  TUserValues,
  {
    state: TRootState;
    rejectValue: TReducerError;
  }
>("clients/create", async (param, { rejectWithValue, getState }) => {
  try {
    const response = await APIcreateUser(param);
    if (response.error) {
      throw Error(response.message);
    } else {
      const data: any = response.data;
      const toReturn: TUser = {
        id: data.id,
        created_at: new Date(changeDateStringFormat(data.created_at)),
        email: data.email,
        noms: data.noms,
        prenoms: data.prenoms,
        telephone: data.telephone,
        profil: {
          id: data.profil_id,
          libelle: defaultProfils[data.profil_id].libelle,
        },
      };
      return toReturn;
    }
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
