import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import itemsReducer from "./items/items.reducer";

export const persistConfig = {
  key: "location",
  storage,
  whitelist: ["items"],
  blacklist: [],
};

const topReducer = combineReducers({
  items: itemsReducer,
});

const rootReducer = (state: any, action: any) => {
  return topReducer(state, action);
};

export default persistReducer(persistConfig, topReducer);
