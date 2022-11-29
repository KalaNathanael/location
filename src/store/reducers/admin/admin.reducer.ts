import { TReducerError } from "@/types";
import { TUser } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";
import { createUserAction, fetchUsersAction } from "./admin.action";

const errorInitialValue: TReducerError = {
  message: "",
  value: null,
};

export type TAdminState = {
  users: {
    loading: "idle" | "pending" | "failed";
    data: TUser[];
    error: TReducerError;
  };
};

const initialState: TAdminState = {
  users: {
    data: [],
    error: errorInitialValue,
    loading: "idle",
  },
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //fetchUsersAction actions
    builder.addCase(fetchUsersAction.pending, (state) => {
      state.users.loading = "pending";
      state.users.error = errorInitialValue;
    });
    builder.addCase(fetchUsersAction.fulfilled, (state, action) => {
      state.users.data = action.payload;
      state.users.loading = "idle";
      state.users.error = errorInitialValue;
    });
    builder.addCase(fetchUsersAction.rejected, (state, action) => {
      state.users.loading = "failed";
      state.users.error = action.payload!;
    });

    //createUserAction actions
    builder.addCase(createUserAction.pending, (state) => {
      state.users.loading = "pending";
      state.users.error = errorInitialValue;
    });
    builder.addCase(createUserAction.fulfilled, (state, action) => {
      state.users.data.push(action.payload);
      state.users.loading = "idle";
      state.users.error = errorInitialValue;
    });
    builder.addCase(createUserAction.rejected, (state, action) => {
      state.users.loading = "failed";
      state.users.error = action.payload!;
    });
  },
});

const { actions, reducer } = adminSlice;
export const {} = actions;
export default reducer;
