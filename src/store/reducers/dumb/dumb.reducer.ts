import { TPost } from "@/features/dumb/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dumbAction, dumbAsyncAction } from "./dumb.action";

export interface TDumbState {
  value: TPost[];
  loading: "idle" | "pending" | "failed"; //machine state is advised
  error: any;
}

const initialState: TDumbState = {
  value: [],
  loading: "idle",
  error: "",
};

export const dumbSlice = createSlice({
  name: "dumb",
  initialState,
  reducers: {
    getPostsList: (state, action: PayloadAction<TPost[]>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(dumbAction, (state) => {
      //faire ce qu'on veut
    });

    //async action typical actions
    builder.addCase(dumbAsyncAction.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(dumbAsyncAction.fulfilled, (state, action) => {
      state.value = action.payload.value;
      state.loading = "idle";
    });
    builder.addCase(dumbAsyncAction.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

const { actions, reducer } = dumbSlice;
export const { getPostsList } = actions;
export default reducer;
