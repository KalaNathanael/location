import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { isDev } from "@/utils/isDev";
import rootReducer from "./reducers/rootReducer";
import { useDispatch } from "react-redux";
import { persistStore } from "redux-persist";

const loggerMiddleware = createLogger({
  predicate: () => isDev(),
  collapsed: true,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      immutableCheck: true,
      serializableCheck: false,
    }).concat(loggerMiddleware),
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export const persistor = persistStore(store);
