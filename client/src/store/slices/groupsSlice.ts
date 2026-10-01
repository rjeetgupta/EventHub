import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  groupService,
  type DepartmentGroup,
  type GroupOverview,
  type GroupsResponse,
  type GroupFilters,
  type CreateGroupRequest,
  type UpdateGroupRequest,
} from '@/services/groupService';

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface GroupsState {
  groups: DepartmentGroup[];
  overview: GroupOverview | null;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };

  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  overview: null,
  pagination: {
    total: 0,
    page: 1,
    totalPages: 0,
    limit: 10,
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

// ============================================================================
// THUNKS
// ============================================================================

export const fetchGroups = createAsyncThunk<
  GroupsResponse,
  Partial<GroupFilters> | undefined,
  { rejectValue: string }
>('groups/fetchGroups', async (filters, { rejectWithValue }) => {
  try {
    return await groupService.getGroups(filters);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch groups');
  }
});

export const fetchGroupOverview = createAsyncThunk<
  GroupOverview,
  void,
  { rejectValue: string }
>('groups/fetchOverview', async (_, { rejectWithValue }) => {
  try {
    return await groupService.getGroupOverview();
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch group overview');
  }
});

export const createGroup = createAsyncThunk<
  DepartmentGroup,
  CreateGroupRequest,
  { rejectValue: string }
>('groups/createGroup', async (data, { rejectWithValue }) => {
  try {
    return await groupService.createGroup(data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to create group');
  }
});

export const updateGroup = createAsyncThunk<
  DepartmentGroup,
  { groupId: string; data: UpdateGroupRequest },
  { rejectValue: string }
>('groups/updateGroup', async ({ groupId, data }, { rejectWithValue }) => {
  try {
    return await groupService.updateGroup(groupId, data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to update group');
  }
});

export const deleteGroup = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('groups/deleteGroup', async (groupId, { rejectWithValue }) => {
  try {
    await groupService.deleteGroup(groupId);
    return groupId;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete group');
  }
});

export const toggleGroupStatus = createAsyncThunk<
  { groupId: string; isActive: boolean },
  { groupId: string; isActive: boolean },
  { rejectValue: string }
>('groups/toggleStatus', async ({ groupId, isActive }, { rejectWithValue }) => {
  try {
    await groupService.toggleGroupStatus(groupId, isActive);
    return { groupId, isActive };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to update group status');
  }
});

// ============================================================================
// SLICE
// ============================================================================

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearGroupsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH GROUPS
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch groups';
      });

    // FETCH OVERVIEW
    builder
      .addCase(fetchGroupOverview.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchGroupOverview.fulfilled, (state, action) => {
        state.overview = action.payload;
      })
      .addCase(fetchGroupOverview.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch group overview';
      });

    // CREATE GROUP
    builder
      .addCase(createGroup.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.isCreating = false;
        state.groups.unshift(action.payload);
        if (state.overview) {
          state.overview = {
            ...state.overview,
            totalGroups: state.overview.totalGroups + 1,
          };
        }
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload || 'Failed to create group';
      });

    // UPDATE GROUP
    builder
      .addCase(updateGroup.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.groups.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.groups[index] = action.payload;
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || 'Failed to update group';
      });

    // DELETE GROUP
    builder
      .addCase(deleteGroup.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.groups = state.groups.filter((g) => g.id !== action.payload);
        if (state.overview) {
          state.overview = {
            ...state.overview,
            totalGroups: Math.max(0, state.overview.totalGroups - 1),
          };
        }
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || 'Failed to delete group';
      });

    // TOGGLE STATUS
    builder
      .addCase(toggleGroupStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(toggleGroupStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.groups.findIndex((g) => g.id === action.payload.groupId);
        if (index !== -1) state.groups[index].isActive = action.payload.isActive;
      })
      .addCase(toggleGroupStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload || 'Failed to update group status';
      });
  },
});

export const { clearGroupsError } = groupsSlice.actions;
export default groupsSlice.reducer;
