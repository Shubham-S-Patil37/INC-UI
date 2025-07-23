import type { RootState } from "../index";

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;

// User role and permissions selectors
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectUserPermissions = (state: RootState) =>
  state.auth.user?.permissions || [];

// Helper selectors for role-based access
export const selectIsAdmin = (state: RootState) =>
  state.auth.user?.role === "admin";
export const selectIsUser = (state: RootState) =>
  state.auth.user?.role === "user";

export const selectHasPermission =
  (permission: string) => (state: RootState) => {
    const permissions = state.auth.user?.permissions || [];
    return permissions.includes(permission);
  };
