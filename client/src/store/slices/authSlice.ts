import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/api/auth.api';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/lib/types/user.types";
import { AuthState } from '@/lib/types/user.types';

/**
 * Initial auth state
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Async Thunks: Login User
 * Login user with email and password
 */
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunks: Register User
 * Register new user
 */
export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunks: Logout User
 * Logout current user
 */
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async thunks: Get User's profile
 * Fetch current authenticated user
 */
export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getCurrentUser();
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunks: Update User Profile
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const updatedUser = await authApi.updateProfile(data);
      return updatedUser;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async Thunks: Change User Profile Password
 * Change user password
 */
export const changeUserPassword = createAsyncThunk<
  void,
  { currentPassword: string; newPassword: string },
  { rejectValue: string }
>(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      await authApi.changePassword(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to change password';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create Async Thunks Slice
 */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      
      // localStorage.removeItem('accessToken');
      // localStorage.removeItem('refreshToken');
    },
    
    /**
     * Set authentication error manually
     */
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
      });

    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Registration failed';
      });

    // LOGOUT
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Even if API fails, clear auth state
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || null;
      });

    // FETCH CURRENT USER
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || 'Failed to fetch user';
      });

    // UPDATE PROFILE
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update profile';
      });

    // CHANGE PASSWORD
    builder
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to change password';
      });
  },
});

export const { clearError, clearAuth, setAuthError } = authSlice.actions;
export default authSlice.reducer;