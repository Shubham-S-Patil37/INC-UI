import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  _id?: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  role: string;
  image?: string;
  createdAt: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  imageUrl?: string;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  imageUrl: undefined,
};

const BASE_URL = "http://localhost:8000/api/users/";
const authHeaders = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return { headers: {} };

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No access token found");
      const res = await axios.get(BASE_URL, authHeaders());
      debugger;
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: Omit<User, "id" | "createdAt">, { rejectWithValue }) => {
    try {
      // const token = localStorage.getItem("accessToken");
      // if (!token) return rejectWithValue("No access token found");

      // const response = await fetch(BASE_URL, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(userData),
      // });

      const res = await axios.post(BASE_URL, userData);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const updateUserAPI = createAsyncThunk(
  "users/updateUser",
  async (user: User, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const deleteUserAPI = createAsyncThunk(
  "users/deleteUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return userId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const uploadUserImage = createAsyncThunk(
  "users/uploadUserImage",
  async ({ file }: { file: File }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:8000/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Assuming the API returns the image URL in res.data.url
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      // Optionally update the user in the users array if present
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      // You can also store the current user separately if needed
      // state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update user
      .addCase(updateUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAPI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user._id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete user
      .addCase(deleteUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Upload user image
      .addCase(uploadUserImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadUserImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUrl = action.payload.url;
        state.error = null;
      })
      .addCase(uploadUserImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addUser,
  updateUser,
  deleteUser,
  setLoading,
  setError,
  setUsers,
  clearError,
  setUser,
} = usersSlice.actions;

export default usersSlice.reducer;
