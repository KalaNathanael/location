import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dumbReducer from "./dumb/dumb.reducer";
import itemsReducer from "./items/items.reducer";

export const persistConfig = {
  key: "location",
  storage,
  whitelist: [],
  blacklist: [],
};

const topReducer = combineReducers({
  dumb: dumbReducer,
  items: itemsReducer,
});

const rootReducer = (state: any, action: any) => {
  return topReducer(state, action);
};

export default persistReducer(persistConfig, rootReducer);
