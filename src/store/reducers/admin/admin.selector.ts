import { TRootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectAdmin = (state: TRootState) => state.admin;

export const selectAdminUsers = createSelector(
  [selectAdmin],
  (admin) => admin.users.data
);
export const selectAdminUsersLoading = createSelector(
  [selectAdmin],
  (admin) => admin.users.loading
);
export const selectAdminUsersError = createSelector(
  [selectAdmin],
  (admin) => admin.users.error
);
