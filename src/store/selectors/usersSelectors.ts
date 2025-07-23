import type { RootState } from "../index";

// Users selectors
export const selectAllUsers = (state: RootState) => state.users.users;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectUserById = (id: number) => (state: RootState) =>
  state.users.users.find((user) => user.id === id);
export const selectUsersByRole = (role: string) => (state: RootState) =>
  state.users.users.filter((user) => user.role === role);
