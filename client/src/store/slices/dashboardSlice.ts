import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dashboardService, AdminDashboardResponse } from '@/services/dashboardService';

interface DashboardState {
  admin: AdminDashboardResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = { admin: null, isLoading: false, error: null };

export const fetchAdminDashboard = createAsyncThunk<AdminDashboardResponse, void, { rejectValue: string }>(
  'dashboard/fetchAdminDashboard',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getAdminDashboard();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch admin dashboard');
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: { clearDashboardError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => { state.isLoading = false; state.admin = action.payload; })
      .addCase(fetchAdminDashboard.rejected, (state, action) => { state.isLoading = false; state.error = action.payload || 'Failed to fetch admin dashboard'; });
  },
});

export default dashboardSlice.reducer;
