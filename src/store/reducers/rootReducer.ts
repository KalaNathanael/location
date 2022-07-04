import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dumbReducer from "./dumb/dumb.reducer";

export const persistConfig = {
  key: "blankProject",
  storage,
  whitelist: [],
  blacklist: [],
};

const topReducer = combineReducers({
  dumb: dumbReducer,
});

const rootReducer = (state: any, action: any) => {
  return topReducer(state, action);
};

export default persistReducer(persistConfig, rootReducer);
