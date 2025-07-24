import type { RootState } from "../index";

// Tasks selectors
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectTaskById = (id: number) => (state: RootState) =>
  state.tasks.tasks.find((task) => task._id === id);
export const selectTasksByAssignee = (userId: number) => (state: RootState) =>
  state.tasks.tasks.filter((task) => task.assignedTo === userId);
export const selectTasksByAssigner = (userId: number) => (state: RootState) =>
  state.tasks.tasks.filter((task) => task.assignedBy === userId);
export const selectTasksByStatus = (status: string) => (state: RootState) =>
  state.tasks.tasks.filter((task) => task.status === status);
export const selectUserTasks = (userId: number) => (state: RootState) =>
  state.tasks.tasks.filter(
    (task) => task.assignedTo === userId || task.assignedBy === userId
  );
