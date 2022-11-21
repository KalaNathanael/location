import { TRootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectItems = (state: TRootState) => state.items;

export const selectItemsEventDetails = createSelector(
  [selectItems],
  (items) => items.eventDetails
);

export const selectItemsClientsDatas = createSelector(
  [selectItems],
  (items) => items.clientList.data
);
export const selectItemsClientsError = createSelector(
  [selectItems],
  (items) => items.clientList.error
);
export const selectItemsClientsLoading = createSelector(
  [selectItems],
  (items) => items.clientList.loading
);

export const selectItemsSelectedCat = createSelector(
  [selectItems],
  (items) => items.selectedCat
);

export const selectItemsSelectedSubCat = createSelector(
  [selectItems],
  (items) => items.selectedSubCat
);

export const selectItemsBasket = createSelector(
  [selectItems],
  (items) => items.basket
);

export const selectItemsLoading = createSelector(
  [selectItems],
  (items) => items.loading
);

export const selectItemsError = createSelector(
  [selectItems],
  (items) => items.error
);
