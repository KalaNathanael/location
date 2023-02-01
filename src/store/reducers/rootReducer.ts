import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import itemsReducer from "./items/items.reducer";
import appReducer from "./app/app.reducer";
import adminReducer from "./admin/admin.reducer";
import logout from "./app/app.reducer";

export const persistConfig = {
  key: "location",
  storage,
  whitelist: ["app", "items", "admin"],
  blacklist: [],
};

const topReducer = combineReducers({
  app: appReducer,
  items: itemsReducer,
  admin: adminReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "app/logout") state = undefined;
  return topReducer(state, action);
};

export default persistReducer(persistConfig, rootReducer);
