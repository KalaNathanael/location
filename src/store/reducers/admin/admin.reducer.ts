import { TCat, TReducerError, TSubCat } from "@/types";
import { TUser } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

  selectedCat: TCat | null;
  selectedSubCat: TSubCat | null;
};

const initialState: TAdminState = {
  users: {
    data: [],
    error: errorInitialValue,
    loading: "idle",
  },
  selectedCat: null,
  selectedSubCat: null,
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setSelectedCat: (state, action: PayloadAction<TCat>) => {
      state.selectedCat = action.payload;
    },
    clearSelectedCat: (state) => {
      state.selectedCat = null;
    },
    setSelectedSubCat: (state, action: PayloadAction<TSubCat>) => {
      state.selectedSubCat = action.payload;
    },
    clearSelectedSubCat: (state) => {
      state.selectedSubCat = null;
    },
  },
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
export const {
  clearSelectedCat,
  clearSelectedSubCat,
  setSelectedCat,
  setSelectedSubCat,
} = actions;
export default reducer;
