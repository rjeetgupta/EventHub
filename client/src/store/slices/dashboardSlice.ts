import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  dashboardService,
  type AdminDashboardData,
  type DashboardDataByRole,
  type DashboardRole,
  type DepartmentDashboardData,
  type GroupDashboardData,
  type StudentDashboardData,
} from '@/services/dashboardService';

type AnyDashboardData =
  | AdminDashboardData
  | DepartmentDashboardData
  | GroupDashboardData
  | StudentDashboardData;

type DashboardState = {
  [R in DashboardRole]: {
    data: DashboardDataByRole[R] | null;
    isLoading: boolean;
    error: string | null;
    hasFetched: boolean;
  };
} & { error: string | null };

const roleInitialState = () => ({
  data: null,
  isLoading: false,
  error: null as string | null,
  hasFetched: false,
});

const initialState: DashboardState = {
  admin: roleInitialState(),
  department: roleInitialState(),
  group: roleInitialState(),
  student: roleInitialState(),
  error: null,
};

type FetchArgs = { role: DashboardRole; force?: boolean };

export const fetchDashboard = createAsyncThunk<
  AnyDashboardData,
  FetchArgs,
  { rejectValue: string }
>('dashboard/fetch', async ({ role }, { rejectWithValue }) => {
  try {
    return await dashboardService.getDashboard(role);
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || 'Failed to fetch dashboard',
    );
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state, action: PayloadAction<DashboardRole | undefined>) => {
      if (action.payload) state[action.payload].error = null;
      else state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state, action) => {
        const role = action.meta.arg.role;
        state[role].isLoading = true;
        state[role].error = null;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        const role = action.meta.arg.role;
        state[role].isLoading = false;
        state[role].hasFetched = true;
        (state[role].data as AnyDashboardData | null) = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        const role = action.meta.arg.role;
        state[role].isLoading = false;
        state[role].error =
          (action.payload as string | undefined) || action.error.message || 'Failed to fetch dashboard';
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
