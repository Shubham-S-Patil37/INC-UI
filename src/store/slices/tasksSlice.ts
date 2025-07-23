import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  assignedBy: number;
  assignedToName: string;
  assignedByName: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  createdAt: string;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [
    {
      id: 1,
      title: "Complete User Authentication",
      description:
        "Implement login and registration functionality with proper validation",
      assignedTo: 2,
      assignedBy: 1,
      assignedToName: "Jane Smith",
      assignedByName: "John Doe",
      status: "in-progress",
      priority: "high",
      dueDate: "2025-07-30",
      createdAt: "2025-07-20",
    },
    {
      id: 2,
      title: "Update User Profile UI",
      description:
        "Redesign the user profile page with better layout and responsiveness",
      assignedTo: 1,
      assignedBy: 1,
      assignedToName: "John Doe",
      assignedByName: "John Doe",
      status: "completed",
      priority: "medium",
      dueDate: "2025-07-25",
      createdAt: "2025-07-18",
    },
  ],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Add a new task
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },

    // Update an existing task
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },

    // Update task status only
    updateTaskStatus: (
      state,
      action: PayloadAction<{
        id: number;
        status: "pending" | "in-progress" | "completed";
      }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },

    // Delete a task
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set all tasks (for initial load or refresh)
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  setLoading,
  setError,
  setTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
