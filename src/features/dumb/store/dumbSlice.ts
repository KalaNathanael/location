import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TPost } from "../interfaces";

export interface DumbState {
  value: TPost[];
}

const initialState: DumbState = {
  value: [],
};

export const dumbSlice = createSlice({
  name: "dumb",
  initialState,
  reducers: {
    getPostsList: (state, action: PayloadAction<TPost[]>) => {
      state.value = action.payload;
    },
  },
});

export const { getPostsList } = dumbSlice.actions;
export default dumbSlice.reducer;
