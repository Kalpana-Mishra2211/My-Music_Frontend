import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../config";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
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
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const res = await api.post(
        "/auth/forgot-password",
        email
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      const res = await api.post(
        "/auth/reset-password",
        { token, password }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { currentPassword, newPassword },
    thunkAPI
  ) => {
    try {
      const res = await api.post(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
        }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    isAuthenticated: false,

    loading: false,

    loginError: null,
    signupError: null,

    forgotPasswordSuccess: null,
    forgotPasswordError: null,

    resetPasswordSuccess: null,
    resetPasswordError: null,

    changePasswordSuccess: null,
    changePasswordError: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    clearChangeMessage: (state) => {
      state.changePasswordSuccess = null;
      state.changePasswordError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loginError = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
        state.isAuthenticated = false;
      })

      // REGISTER
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
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.forgotPasswordError = null;
        state.forgotPasswordSuccess = null;
      })

      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordSuccess =
          action.payload.message;
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPasswordError =
          action.payload;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = null;
      })

      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.resetPasswordSuccess =
          action.payload.message;
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.resetPasswordError =
          action.payload;
      })

      // CHANGE PASSWORD
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = null;
      })

      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.changePasswordError = null;
        state.changePasswordSuccess =
          action.payload.message;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.changePasswordError =
          action.payload;
        state.changePasswordSuccess = null;
      });
  },
});

export const {
  logout,
  clearChangeMessage,
} = authSlice.actions;

export default authSlice.reducer;