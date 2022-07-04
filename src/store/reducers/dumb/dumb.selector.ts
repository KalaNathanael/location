import { TRootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectDumb = (state: TRootState) => state.dumb;

export const selectDumbValue = createSelector(
  [selectDumb],
  (dumb) => dumb.value
);

export const selectDumbLoading = createSelector(
  [selectDumb],
  (dumb) => dumb.loading
);

export const selectDumbError = createSelector(
  [selectDumb],
  (dumb) => dumb.error
);
