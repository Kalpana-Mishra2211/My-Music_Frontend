import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/auth/register", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    signupError: null

  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;

      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.signupError = null;

      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.signupError = null;

      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.signupError = action.payload;

      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;