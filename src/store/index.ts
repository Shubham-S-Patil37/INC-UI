import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import usersSlice from "./slices/usersSlice";
import tasksSlice from "./slices/tasksSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
    tasks: tasksSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
