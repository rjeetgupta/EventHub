import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { departmentApi } from '@/api/department.api';
import {
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
  PermissionDefinition,
} from "@/lib/schema/department.schema";

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface DepartmentState {
  departments: Department[];
  currentDepartment: Department | null;
  groupAdmins: GroupAdmin[];
  currentGroupAdmin: GroupAdmin | null;
  availablePermissions: PermissionDefinition[];
  
  departmentsPagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
  
  groupAdminsPagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
  
  isLoading: boolean;
  isCreatingDepartment: boolean;
  isUpdatingDepartment: boolean;
  isDeletingDepartment: boolean;
  isAssigningAdmin: boolean;
  isUpdatingPermissions: boolean;
  
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  currentDepartment: null,
  groupAdmins: [],
  currentGroupAdmin: null,
  availablePermissions: [],
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
    limit: 20,
  },
  isLoading: false,
  isCreatingDepartment: false,
  isUpdatingDepartment: false,
  isDeletingDepartment: false,
  isAssigningAdmin: false,
  isUpdatingPermissions: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS - DEPARTMENTS
// ============================================================================

export const fetchDepartments = createAsyncThunk<
  DepartmentsResponse,
  Partial<DepartmentFilters> | undefined,
  { rejectValue: string }
>(
  'department/fetchDepartments',
  async (filters, { rejectWithValue }) => {
    try {
      const normalizedFilters: DepartmentFilters = {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 10,
        sortBy: filters?.sortBy ?? "createdAt",
        sortOrder: filters?.sortOrder ?? "desc",
        search: filters?.search,
        isActive: filters?.isActive,
      };
      return await departmentApi.getDepartments(normalizedFilters);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch departments');
    }
  }
);

export const fetchDepartmentById = createAsyncThunk<
  Department,
  string,
  { rejectValue: string }
>(
  'department/fetchDepartmentById',
  async (id, { rejectWithValue }) => {
    try {
      return await departmentApi.getDepartmentById(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch department');
    }
  }
);

export const createDepartment = createAsyncThunk<
  Department,
  CreateDepartmentRequest,
  { rejectValue: string }
>(
  'department/createDepartment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await departmentApi.createDepartment(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create department');
    }
  }
);

export const updateDepartment = createAsyncThunk<
  Department,
  { id: string; data: UpdateDepartmentRequest },
  { rejectValue: string }
>(
  'department/updateDepartment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await departmentApi.updateDepartment(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update department');
    }
  }
);

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
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete department');
    }
  }
);

export const toggleDepartmentStatus = createAsyncThunk<
  Department,
  { id: string; isActive: boolean },
  { rejectValue: string }
>(
  'department/toggleStatus',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      return await departmentApi.toggleDepartmentStatus(id, isActive);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle status');
    }
  }
);

// ============================================================================
// ASYNC THUNKS - GROUP ADMINS
// ============================================================================

// export const fetchGroupAdmins = createAsyncThunk<
//   GroupAdminsResponse,
//   { departmentId: string; filters?: Partial<GroupAdminFilters> },
//   { rejectValue: string }
// >(
//   'department/fetchGroupAdmins',
//   async ({ departmentId, filters }, { rejectWithValue }) => {
//     try {
//       return await departmentApi.getGroupAdmins(departmentId, filters);
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Failed to fetch group admins');
//     }
//   }
// );

export const fetchGroupAdminById = createAsyncThunk<
  GroupAdmin,
  { departmentId: string; groupAdminId: string },
  { rejectValue: string }
>(
  'department/fetchGroupAdminById',
  async ({ departmentId, groupAdminId }, { rejectWithValue }) => {
    try {
      return await departmentApi.getGroupAdminById(departmentId, groupAdminId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch group admin');
    }
  }
);

export const assignGroupAdmin = createAsyncThunk<
  GroupAdmin,
  { departmentId: string; data: AssignGroupAdminRequest },
  { rejectValue: string }
>(
  'department/assignGroupAdmin',
  async ({ departmentId, data }, { rejectWithValue }) => {
    try {
      return await departmentApi.assignGroupAdmin(departmentId, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign group admin');
    }
  }
);

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
      return await departmentApi.updateGroupAdminPermissions(
        departmentId,
        groupAdminId,
        data
      );
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update permissions');
    }
  }
);

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
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove group admin');
    }
  }
);

export const toggleGroupAdminStatus = createAsyncThunk<
  GroupAdmin,
  { departmentId: string; groupAdminId: string; isActive: boolean },
  { rejectValue: string }
>(
  'department/toggleGroupAdminStatus',
  async ({ departmentId, groupAdminId, isActive }, { rejectWithValue }) => {
    try {
      return await departmentApi.toggleGroupAdminStatus(
        departmentId,
        groupAdminId,
        isActive
      );
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle status');
    }
  }
);

// ============================================================================
// ASYNC THUNKS - PERMISSIONS
// ============================================================================

export const fetchAvailablePermissions = createAsyncThunk<
  PermissionDefinition[],
  void,
  { rejectValue: string }
>(
  'department/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      return await departmentApi.getAvailablePermissions();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch permissions');
    }
  }
);

// ============================================================================
// SLICE
// ============================================================================

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
    setDepartmentError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
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
        state.departmentsPagination = action.payload.pagination;
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
        
        const index = state.departments.findIndex(d => d.id === action.payload.id);
        if (index !== -1) state.departments[index] = action.payload;
        
        if (state.currentDepartment?.id === action.payload.id) {
          state.currentDepartment = action.payload;
        }
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
        state.departments = state.departments.filter(d => d.id !== action.payload);
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
        
        const index = state.departments.findIndex(d => d.id === action.payload.id);
        if (index !== -1) state.departments[index] = action.payload;
        
        if (state.currentDepartment?.id === action.payload.id) {
          state.currentDepartment = action.payload;
        }
      })
      .addCase(toggleDepartmentStatus.rejected, (state, action) => {
        state.isUpdatingDepartment = false;
        state.error = action.payload || 'Failed to toggle status';
      });

    // FETCH GROUP ADMINS
    // builder
    //   .addCase(fetchGroupAdmins.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchGroupAdmins.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.groupAdmins = action.payload.data;
    //     state.groupAdminsPagination = action.payload.pagination;
    //   })
    //   .addCase(fetchGroupAdmins.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload || 'Failed to fetch group admins';
    //   });

    // FETCH GROUP ADMIN BY ID
    builder
      .addCase(fetchGroupAdminById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupAdminById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGroupAdmin = action.payload;
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
        
        const index = state.groupAdmins.findIndex(g => g.id === action.payload.id);
        if (index !== -1) state.groupAdmins[index] = action.payload;
        
        if (state.currentGroupAdmin?.id === action.payload.id) {
          state.currentGroupAdmin = action.payload;
        }
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
        state.groupAdmins = state.groupAdmins.filter(g => g.id !== action.payload);
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
        
        const index = state.groupAdmins.findIndex(g => g.id === action.payload.id);
        if (index !== -1) state.groupAdmins[index] = action.payload;
        
        if (state.currentGroupAdmin?.id === action.payload.id) {
          state.currentGroupAdmin = action.payload;
        }
      })
      .addCase(toggleGroupAdminStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to toggle status';
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
      })
      .addCase(fetchAvailablePermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch permissions';
      });
  },
});

export const {
  clearError,
  clearCurrentDepartment,
  clearCurrentGroupAdmin,
  setDepartmentError,
  resetDepartmentState,
} = departmentSlice.actions;

export default departmentSlice.reducer;