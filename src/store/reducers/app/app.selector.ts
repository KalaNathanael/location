import { TRootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectApp = (state: TRootState) => state.app;

export const selectConnectedUser = createSelector(
  [selectApp],
  (app) => app.connectedUser
);

export const selectAppError = createSelector([selectApp], (app) => app.error);

export const selectAppLoading = createSelector(
  [selectApp],
  (app) => app.loading
);
