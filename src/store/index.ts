import { configureStore } from "@reduxjs/toolkit";
import dumbReducer from "@/features/dumb/store/dumbSlice";

export const store = configureStore({
  reducer: {
    dumb: dumbReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
