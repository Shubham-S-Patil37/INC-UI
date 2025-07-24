import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./../../store"; // 👈 Adjust this path based on your project structure
// 👈 Adjust this path based on your project structure

export interface Task {
  _id?: number;
  title: string;
  userName?: string; // Optional, if you want to display the username
  password?: string; // Optional, if you want to handle password in tasks
  description: string;
  assignedTo: number;
  assignedBy: number;
  assignedToName?: string;
  assignedByName?: string;
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
  tasks: [],
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:8000/api/tasks/"; // 🔧 Adjust accordingly

// Utility to build auth headers from accessToken
const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// ✅ Fetch tasks
export const fetchTasks = createAsyncThunk<
  Task[],
  void,
  { state: RootState; rejectValue: string }
>("tasks/fetchTasks", async (_, { getState, rejectWithValue }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return rejectWithValue("No access token found");

  try {
    const res = await axios.get(BASE_URL, authHeaders(token));
    return res.data.data; // or res.data depending on API
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch tasks"
    );
  }
});

// ✅ Create task
export const createTask = createAsyncThunk<
  Task,
  Task,
  { state: RootState; rejectValue: string }
>("tasks/createTask", async (task, { getState, rejectWithValue }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return rejectWithValue("No access token found");
  try {
    const res = await axios.post(BASE_URL, task, authHeaders(token));
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create task"
    );
  }
});

// ✅ Update task
export const updateTaskApi = createAsyncThunk<
  Task,
  Task,
  { state: RootState; rejectValue: string }
>("tasks/updateTask", async (task, { getState, rejectWithValue }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return rejectWithValue("No access token found");

  try {
    const res = await axios.put(
      `${BASE_URL}/${task._id}`,
      task,
      authHeaders(token)
    );
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update task"
    );
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Optional: Local state updates if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error loading tasks";
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      .addCase(updateTaskApi.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.tasks[index] = action.payload;
      });
  },
});

export default tasksSlice.reducer;
