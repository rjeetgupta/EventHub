import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { departmentApi } from '@/api/department.api';
import type {
  Department,
  DepartmentsResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentFilters,
  GroupAdmin,
  GroupAdminsResponse,
  GroupAdminFilters,
  AssignGroupAdminRequest,
  UpdateGroupAdminPermissionsRequest,
  DepartmentAnalytics,
  DepartmentAnalyticsFilters,
  PermissionDefinition,
} from "@/lib/types/department.types";
import { DepartmentState } from '@/lib/types/department.types';


/**
 * Initial department state
 */
const initialState: DepartmentState = {
  departments: [],
  currentDepartment: null,
  groupAdmins: [],
  currentGroupAdmin: null,
  availablePermissions: [],
  analytics: null,
  departmentsPagination: {
    total: 0,
    page: 1,
    totalPages: 0,
    limit: 10,
  },
  groupAdminsPagination: {
    total: 0,
    page: 1,
    totalPages: 0,
    limit: 10,
  },
  isLoading: false,
  isLoadingAnalytics: false,
  isCreatingDepartment: false,
  isUpdatingDepartment: false,
  isDeletingDepartment: false,
  isAssigningAdmin: false,
  isUpdatingPermissions: false,
  error: null,
};

/**
 * Fetch all departments with filters
 */
export const fetchDepartments = createAsyncThunk<
  DepartmentsResponse,
  DepartmentFilters | undefined,
  { rejectValue: string }
>(
  'department/fetchDepartments',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getDepartments(filters);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch departments';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single department by ID
 */
export const fetchDepartmentById = createAsyncThunk<
  Department,
  string,
  { rejectValue: string }
>(
  'department/fetchDepartmentById',
  async (id, { rejectWithValue }) => {
    try {
      const department = await departmentApi.getDepartmentById(id);
      return department;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch department';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create new department
 */
export const createDepartment = createAsyncThunk<
  Department,
  CreateDepartmentRequest,
  { rejectValue: string }
>(
  'department/createDepartment',
  async (data, { rejectWithValue }) => {
    try {
      const department = await departmentApi.createDepartment(data);
      return department;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create department';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update existing department
 */
export const updateDepartment = createAsyncThunk<
  Department,
  { id: string; data: UpdateDepartmentRequest },
  { rejectValue: string }
>(
  'department/updateDepartment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const department = await departmentApi.updateDepartment(id, data);
      return department;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update department';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete department
 */
export const deleteDepartment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'department/deleteDepartment',
  async (id, { rejectWithValue }) => {
    try {
      await departmentApi.deleteDepartment(id);
      return id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete department';
      return rejectWithValue(message);
    }
  }
);

/**
 * Toggle department status
 */
export const toggleDepartmentStatus = createAsyncThunk<
  Department,
  { id: string; isActive: boolean },
  { rejectValue: string }
>(
  'department/toggleStatus',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const department = await departmentApi.toggleDepartmentStatus(id, isActive);
      return department;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle department status';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch group admins for a department
 */
export const fetchGroupAdmins = createAsyncThunk<
  GroupAdminsResponse,
  { departmentId: string; filters?: GroupAdminFilters },
  { rejectValue: string }
>(
  'department/fetchGroupAdmins',
  async ({ departmentId, filters }, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getGroupAdmins(departmentId, filters);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch group admins';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single group admin by ID
 */
export const fetchGroupAdminById = createAsyncThunk<
  GroupAdmin,
  { departmentId: string; groupAdminId: string },
  { rejectValue: string }
>(
  'department/fetchGroupAdminById',
  async ({ departmentId, groupAdminId }, { rejectWithValue }) => {
    try {
      const groupAdmin = await departmentApi.getGroupAdminById(departmentId, groupAdminId);
      return groupAdmin;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch group admin';
      return rejectWithValue(message);
    }
  }
);

/**
 * Assign a user as group admin
 */
export const assignGroupAdmin = createAsyncThunk<
  GroupAdmin,
  { departmentId: string; data: AssignGroupAdminRequest },
  { rejectValue: string }
>(
  'department/assignGroupAdmin',
  async ({ departmentId, data }, { rejectWithValue }) => {
    try {
      const groupAdmin = await departmentApi.assignGroupAdmin(departmentId, data);
      return groupAdmin;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to assign group admin';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update group admin permissions
 */
export const updateGroupAdminPermissions = createAsyncThunk<
  GroupAdmin,
  {
    departmentId: string;
    groupAdminId: string;
    data: UpdateGroupAdminPermissionsRequest;
  },
  { rejectValue: string }
>(
  'department/updatePermissions',
  async ({ departmentId, groupAdminId, data }, { rejectWithValue }) => {
    try {
      const groupAdmin = await departmentApi.updateGroupAdminPermissions(
        departmentId,
        groupAdminId,
        data
      );
      return groupAdmin;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update permissions';
      return rejectWithValue(message);
    }
  }
);

/**
 * Remove group admin
 */
export const removeGroupAdmin = createAsyncThunk<
  string,
  { departmentId: string; groupAdminId: string },
  { rejectValue: string }
>(
  'department/removeGroupAdmin',
  async ({ departmentId, groupAdminId }, { rejectWithValue }) => {
    try {
      await departmentApi.removeGroupAdmin(departmentId, groupAdminId);
      return groupAdminId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove group admin';
      return rejectWithValue(message);
    }
  }
);

/**
 * Toggle group admin status
 */
export const toggleGroupAdminStatus = createAsyncThunk<
  GroupAdmin,
  { departmentId: string; groupAdminId: string; isActive: boolean },
  { rejectValue: string }
>(
  'department/toggleGroupAdminStatus',
  async ({ departmentId, groupAdminId, isActive }, { rejectWithValue }) => {
    try {
      const groupAdmin = await departmentApi.toggleGroupAdminStatus(
        departmentId,
        groupAdminId,
        isActive
      );
      return groupAdmin;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle group admin status';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch available permissions
 */
export const fetchAvailablePermissions = createAsyncThunk<
  PermissionDefinition[],
  void,
  { rejectValue: string }
>(
  'department/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const permissions = await departmentApi.getAvailablePermissions();
      return permissions;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch permissions';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch department analytics
 */
export const fetchDepartmentAnalytics = createAsyncThunk<
  DepartmentAnalytics,
  { departmentId: string; filters?: DepartmentAnalyticsFilters },
  { rejectValue: string }
>(
  'department/fetchAnalytics',
  async ({ departmentId, filters }, { rejectWithValue }) => {
    try {
      const analytics = await departmentApi.getDepartmentAnalytics(departmentId, filters);
      return analytics;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch analytics';
      return rejectWithValue(message);
    }
  }
);

/**
 * Export analytics report
 */
export const exportDepartmentAnalytics = createAsyncThunk<
  void,
  {
    departmentId: string;
    format: 'pdf' | 'excel';
    filters?: DepartmentAnalyticsFilters;
  },
  { rejectValue: string }
>(
  'department/exportAnalytics',
  async ({ departmentId, format, filters }, { rejectWithValue }) => {
    try {
      const blob = await departmentApi.exportAnalytics(departmentId, format, filters);
      
      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `department-analytics-${departmentId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export analytics';
      return rejectWithValue(message);
    }
  }
);

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {

    clearError: (state) => {
      state.error = null;
    },
    
    clearCurrentDepartment: (state) => {
      state.currentDepartment = null;
    },
    
    clearCurrentGroupAdmin: (state) => {
      state.currentGroupAdmin = null;
    },
    
    clearAnalytics: (state) => {
      state.analytics = null;
    },
    
    setDepartmentError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    resetDepartmentState: () => initialState,
  },
  extraReducers: (builder) => {
    // FETCH DEPARTMENTS
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = action.payload.data;
        state.departmentsPagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          limit: action.payload.limit,
        };
        state.error = null;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch departments';
      });

    // FETCH DEPARTMENT BY ID
    builder
      .addCase(fetchDepartmentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDepartment = action.payload;
        state.error = null;
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch department';
      });

    // CREATE DEPARTMENT
    builder
      .addCase(createDepartment.pending, (state) => {
        state.isCreatingDepartment = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.isCreatingDepartment = false;
        state.departments.unshift(action.payload);
        state.error = null;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.isCreatingDepartment = false;
        state.error = action.payload || 'Failed to create department';
      });

    // UPDATE DEPARTMENT
    builder
      .addCase(updateDepartment.pending, (state) => {
        state.isUpdatingDepartment = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isUpdatingDepartment = false;
        
        const index = state.departments.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
        
        if (state.currentDepartment?.id === action.payload.id) {
          state.currentDepartment = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isUpdatingDepartment = false;
        state.error = action.payload || 'Failed to update department';
      });

    // DELETE DEPARTMENT
    builder
      .addCase(deleteDepartment.pending, (state) => {
        state.isDeletingDepartment = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isDeletingDepartment = false;
        state.departments = state.departments.filter((d) => d.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isDeletingDepartment = false;
        state.error = action.payload || 'Failed to delete department';
      });

    // TOGGLE DEPARTMENT STATUS
    builder
      .addCase(toggleDepartmentStatus.pending, (state) => {
        state.isUpdatingDepartment = true;
        state.error = null;
      })
      .addCase(toggleDepartmentStatus.fulfilled, (state, action) => {
        state.isUpdatingDepartment = false;
        
        const index = state.departments.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
        
        if (state.currentDepartment?.id === action.payload.id) {
          state.currentDepartment = action.payload;
        }
        
        state.error = null;
      })
      .addCase(toggleDepartmentStatus.rejected, (state, action) => {
        state.isUpdatingDepartment = false;
        state.error = action.payload || 'Failed to toggle department status';
      });

    // FETCH GROUP ADMINS
    builder
      .addCase(fetchGroupAdmins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groupAdmins = action.payload.groupAdmins;
        state.groupAdminsPagination = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          limit: action.payload.limit,
        };
        state.error = null;
      })
      .addCase(fetchGroupAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch group admins';
      });

    // FETCH GROUP ADMIN BY ID
    builder
      .addCase(fetchGroupAdminById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupAdminById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGroupAdmin = action.payload;
        state.error = null;
      })
      .addCase(fetchGroupAdminById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch group admin';
      });

    // ASSIGN GROUP ADMIN
    builder
      .addCase(assignGroupAdmin.pending, (state) => {
        state.isAssigningAdmin = true;
        state.error = null;
      })
      .addCase(assignGroupAdmin.fulfilled, (state, action) => {
        state.isAssigningAdmin = false;
        state.groupAdmins.unshift(action.payload);
        state.error = null;
      })
      .addCase(assignGroupAdmin.rejected, (state, action) => {
        state.isAssigningAdmin = false;
        state.error = action.payload || 'Failed to assign group admin';
      });

    // UPDATE GROUP ADMIN PERMISSIONS
    builder
      .addCase(updateGroupAdminPermissions.pending, (state) => {
        state.isUpdatingPermissions = true;
        state.error = null;
      })
      .addCase(updateGroupAdminPermissions.fulfilled, (state, action) => {
        state.isUpdatingPermissions = false;
        
        const index = state.groupAdmins.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.groupAdmins[index] = action.payload;
        }
        
        if (state.currentGroupAdmin?.id === action.payload.id) {
          state.currentGroupAdmin = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateGroupAdminPermissions.rejected, (state, action) => {
        state.isUpdatingPermissions = false;
        state.error = action.payload || 'Failed to update permissions';
      });

    // REMOVE GROUP ADMIN
    builder
      .addCase(removeGroupAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeGroupAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groupAdmins = state.groupAdmins.filter((g) => g.id !== action.payload);
        state.error = null;
      })
      .addCase(removeGroupAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to remove group admin';
      });

    // TOGGLE GROUP ADMIN STATUS
    builder
      .addCase(toggleGroupAdminStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleGroupAdminStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const index = state.groupAdmins.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.groupAdmins[index] = action.payload;
        }
        
        if (state.currentGroupAdmin?.id === action.payload.id) {
          state.currentGroupAdmin = action.payload;
        }
        
        state.error = null;
      })
      .addCase(toggleGroupAdminStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to toggle group admin status';
      });

    // FETCH AVAILABLE PERMISSIONS
    builder
      .addCase(fetchAvailablePermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailablePermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availablePermissions = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailablePermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch permissions';
      });

    // FETCH ANALYTICS
    builder
      .addCase(fetchDepartmentAnalytics.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.error = null;
      })
      .addCase(fetchDepartmentAnalytics.fulfilled, (state, action) => {
        state.isLoadingAnalytics = false;
        state.analytics = action.payload;
        state.error = null;
      })
      .addCase(fetchDepartmentAnalytics.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.error = action.payload || 'Failed to fetch analytics';
      });

    // EXPORT ANALYTICS
    builder
      .addCase(exportDepartmentAnalytics.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.error = null;
      })
      .addCase(exportDepartmentAnalytics.fulfilled, (state) => {
        state.isLoadingAnalytics = false;
        state.error = null;
      })
      .addCase(exportDepartmentAnalytics.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.error = action.payload || 'Failed to export analytics';
      });
  },
});

export const {
  clearError,
  clearCurrentDepartment,
  clearCurrentGroupAdmin,
  clearAnalytics,
  setDepartmentError,
  resetDepartmentState,
} = departmentSlice.actions;

export default departmentSlice.reducer;