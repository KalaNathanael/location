import { TReducerError } from "@/types";
import { TUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const errorInitialValue: TReducerError = {
  message: "",
  value: null,
};

export type TAppState = {
  connectedUser: TUser | null;
  loading: "idle" | "pending" | "failed";
  error: TReducerError;
};

const initialState: TAppState = {
  connectedUser: null,
  error: errorInitialValue,
  loading: "idle",
};
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setConnectedUser: (state, action: PayloadAction<TUser>) => {
      state.connectedUser = action.payload;
    },
    logout: (state) => {
      const { connectedUser, error, loading } = initialState;
      state.error = error;
      state.connectedUser = connectedUser;
      state.loading = loading;
    },
  },
});

const { actions, reducer } = appSlice;
export const { setConnectedUser, logout } = actions;
export default reducer;
