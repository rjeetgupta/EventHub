import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { departmentService } from '@/services/department';
import {
  Department,
  DepartmentsResponse,
  CreateDepartmentRequest,
  CreateDepartmentResponse,
  UpdateDepartmentRequest,
  DepartmentFilters,
  GroupAdmin,
  GroupAdminsResponse,
  GroupAdminFilters,
  AssignGroupAdminRequest,
  UpdateGroupAdminPermissionsRequest,
  PermissionDefinition,
  DepartmentAnalytics,
  DepartmentRegistrations,
  DepartmentRegistrationsFilters,
  DepartmentStudents,
  DepartmentStudentsFilters,
  CreateDepartmentStudentRequest,
} from '@/lib/schema/department.schema';

interface DepartmentState {
  // Department data
  departments: Department[];
  currentDepartment: Department | null;
  
  // Group admin data
  groupAdmins: GroupAdmin[];
  currentGroupAdmin: GroupAdmin | null;
  
  // Permissions data
  availablePermissions: PermissionDefinition[];
  
  // Analytics data
  analytics: DepartmentAnalytics | null;

  // Registrations data (department-wide registrations screen)
  registrations: DepartmentRegistrations | null;

  // Students data (department students screen)
  students: DepartmentStudents | null;
  isAddingStudent: boolean;
  isTogglingStudent: boolean;
  
  // Pagination
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
  
  // Loading states
  isLoading: boolean;
  isCreatingDepartment: boolean;
  isUpdatingDepartment: boolean;
  isDeletingDepartment: boolean;
  isLoadingAnalytics: boolean;
  isLoadingRegistrations: boolean;
  isLoadingStudents: boolean;
  
  // Group admin loading states
  isLoadingGroupAdmins: boolean;
  isAssigningAdmin: boolean;
  isUpdatingPermissions: boolean;
  isRemovingAdmin: boolean;
  
  // Error state
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  currentDepartment: null,
  groupAdmins: [],
  currentGroupAdmin: null,
  availablePermissions: [],
  analytics: null,
  registrations: null,
  students: null,
  
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
  isLoadingAnalytics: false,
  isLoadingRegistrations: false,
  isLoadingStudents: false,
  isAddingStudent: false,
  isTogglingStudent: false,
  
  isLoadingGroupAdmins: false,
  isAssigningAdmin: false,
  isUpdatingPermissions: false,
  isRemovingAdmin: false,
  
  error: null,
};

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
        sortBy: filters?.sortBy ?? 'createdAt',
        sortOrder: filters?.sortOrder ?? 'desc',
        search: filters?.search,
        isActive: filters?.isActive,
      };
      return await departmentService.getDepartments(normalizedFilters)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch departments');
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
      return await departmentService.getDepartmentById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch department');
    }
  }
);

export const createDepartment = createAsyncThunk<
  CreateDepartmentResponse,
  CreateDepartmentRequest,
  { rejectValue: string }
>(
  'department/createDepartment',
  async (data, { rejectWithValue }) => {
    try {
      return await departmentService.createDepartment(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create department');
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
      return await departmentService.updateDepartment(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update department');
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
      await departmentService.deleteDepartment(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete department');
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
      return await departmentService.toggleDepartmentStatus(id, isActive);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to toggle status');
    }
  }
);

export const fetchDepartmentAnalytics = createAsyncThunk<
  DepartmentAnalytics,
  { id: string; filters?: { startDate?: string; endDate?: string } },
  { rejectValue: string }
>(
  'department/fetchAnalytics',
  async ({ id, filters }, { rejectWithValue }) => {
    try {
      return await departmentService.getDepartmentAnalytics(id, filters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch analytics');
    }
  }
);

export const fetchDepartmentRegistrations = createAsyncThunk<
  DepartmentRegistrations,
  { departmentId: string; filters?: Partial<DepartmentRegistrationsFilters> },
  { rejectValue: string }
>(
  'department/fetchRegistrations',
  async ({ departmentId, filters }, { rejectWithValue }) => {
    try {
      const normalizedFilters: Partial<DepartmentRegistrationsFilters> = {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 10,
        sortOrder: filters?.sortOrder ?? 'desc',
        eventId: filters?.eventId,
        status: filters?.status,
        search: filters?.search,
        group: filters?.group,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
      };
      return await departmentService.getDepartmentRegistrations(departmentId, normalizedFilters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch registrations');
    }
  }
);

export const fetchDepartmentStudents = createAsyncThunk<
  DepartmentStudents,
  { departmentId: string; filters?: Partial<DepartmentStudentsFilters> },
  { rejectValue: string }
>(
  'department/fetchStudents',
  async ({ departmentId, filters }, { rejectWithValue }) => {
    try {
      const normalizedFilters: Partial<DepartmentStudentsFilters> = {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 10,
        sortBy: filters?.sortBy ?? 'eventsJoined',
        sortOrder: filters?.sortOrder ?? 'desc',
        search: filters?.search,
        year: filters?.year,
        section: filters?.section,
        status: filters?.status,
      };
      return await departmentService.getDepartmentStudents(departmentId, normalizedFilters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch students');
    }
  }
);

export const addDepartmentStudent = createAsyncThunk<
  { id: string; fullName: string; email: string; studentID?: string; isActive: boolean },
  { departmentId: string; data: CreateDepartmentStudentRequest },
  { rejectValue: string }
>(
  'department/addStudent',
  async ({ departmentId, data }, { rejectWithValue }) => {
    try {
      return await departmentService.createDepartmentStudent(departmentId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add student');
    }
  }
);

export const toggleDepartmentStudent = createAsyncThunk<
  { id: string; fullName: string; email: string; studentID?: string; isActive: boolean },
  { departmentId: string; studentId: string; isActive: boolean },
  { rejectValue: string }
>(
  'department/toggleStudentStatus',
  async ({ departmentId, studentId, isActive }, { rejectWithValue }) => {
    try {
      return await departmentService.toggleDepartmentStudentStatus(departmentId, studentId, isActive);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update student status');
    }
  }
);

// ASYNC THUNKS - GROUP ADMINS

export const fetchGroupAdmins = createAsyncThunk<
  GroupAdminsResponse,
  { departmentId: string; filters?: Partial<GroupAdminFilters> },
  { rejectValue: string }
>(
  'department/fetchGroupAdmins',
  async ({ departmentId, filters }, { rejectWithValue }) => {
    try {
      const normalizedFilters: GroupAdminFilters = {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 20,
        search: filters?.search,
        isActive: filters?.isActive,
      };
      return await departmentService.getGroupAdmins(departmentId, normalizedFilters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch group admins');
    }
  }
);

export const fetchGroupAdminById = createAsyncThunk<
  GroupAdmin,
  { departmentId: string; groupAdminId: string },
  { rejectValue: string }
>(
  'department/fetchGroupAdminById',
  async ({ departmentId, groupAdminId }, { rejectWithValue }) => {
    try {
      return await departmentService.getGroupAdminById(departmentId, groupAdminId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch group admin');
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
      return await departmentService.assignGroupAdmin(departmentId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to assign group admin');
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
      return await departmentService.updateGroupAdminPermissions(
        departmentId,
        groupAdminId,
        data
      );
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update permissions');
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
      await departmentService.removeGroupAdmin(departmentId, groupAdminId);
      return groupAdminId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to remove group admin');
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
      return await departmentService.toggleGroupAdminStatus(
        departmentId,
        groupAdminId,
        isActive
      );
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to toggle status');
    }
  }
);

// ASYNC THUNKS - PERMISSIONS


export const fetchAvailablePermissions = createAsyncThunk<
  PermissionDefinition[],
  void,
  { rejectValue: string }
>(
  'department/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      return await departmentService.getAvailablePermissions();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch permissions');
    }
  }
);


// SLICE

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
    clearGroupAdmins: (state) => {
      state.groupAdmins = [];
      state.groupAdminsPagination = initialState.groupAdminsPagination;
    },
    clearAnalytics: (state) => {
      state.analytics = null;
    },
    clearRegistrations: (state) => {
      state.registrations = null;
    },
    clearStudents: (state) => {
      state.students = null;
    },
    setDepartmentError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetDepartmentState: () => initialState,
  },
  extraReducers: (builder) => {
    // ========================================================================
    // FETCH DEPARTMENTS
    // ========================================================================
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

    // ========================================================================
    // FETCH DEPARTMENT BY ID
    // ========================================================================
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

    // ========================================================================
    // CREATE DEPARTMENT
    // ========================================================================
    builder
      .addCase(createDepartment.pending, (state) => {
        state.isCreatingDepartment = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.isCreatingDepartment = false;
        // Add the created department to the list
        state.departments.unshift(action.payload.department);
        state.currentDepartment = action.payload.department;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.isCreatingDepartment = false;
        state.error = action.payload || 'Failed to create department';
      });

    // ========================================================================
    // UPDATE DEPARTMENT
    // ========================================================================
    builder
      .addCase(updateDepartment.pending, (state) => {
        state.isUpdatingDepartment = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isUpdatingDepartment = false;
        
        // Update in departments list
        const index = state.departments.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
        
        // Update current department if it's the same one
        if (state.currentDepartment?.id === action.payload.id) {
          state.currentDepartment = action.payload;
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isUpdatingDepartment = false;
        state.error = action.payload || 'Failed to update department';
      });

    // ========================================================================
    // DELETE DEPARTMENT
    // ========================================================================
    builder
      .addCase(deleteDepartment.pending, (state) => {
        state.isDeletingDepartment = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isDeletingDepartment = false;
        // Remove from departments list
        state.departments = state.departments.filter(d => d.id !== action.payload);
        // Clear current department if it was deleted
        if (state.currentDepartment?.id === action.payload) {
          state.currentDepartment = null;
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isDeletingDepartment = false;
        state.error = action.payload || 'Failed to delete department';
      });

    // ========================================================================
    // TOGGLE DEPARTMENT STATUS
    // ========================================================================
    builder
      .addCase(toggleDepartmentStatus.pending, (state) => {
        state.isUpdatingDepartment = true;
        state.error = null;
      })
      .addCase(toggleDepartmentStatus.fulfilled, (state, action) => {
        state.isUpdatingDepartment = false;
        
        // Update in departments list
        const index = state.departments.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
        
        // Update current department if it's the same one
        if (state.currentDepartment?.id === action.payload.id) {
          state.currentDepartment = action.payload;
        }
      })
      .addCase(toggleDepartmentStatus.rejected, (state, action) => {
        state.isUpdatingDepartment = false;
        state.error = action.payload || 'Failed to toggle status';
      });

    // ========================================================================
    // FETCH DEPARTMENT ANALYTICS
    // ========================================================================
    builder
      .addCase(fetchDepartmentAnalytics.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.error = null;
      })
      .addCase(fetchDepartmentAnalytics.fulfilled, (state, action) => {
        state.isLoadingAnalytics = false;
        state.analytics = action.payload;
      })
      .addCase(fetchDepartmentAnalytics.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.error = action.payload || 'Failed to fetch analytics';
      });

    // ========================================================================
    // FETCH DEPARTMENT REGISTRATIONS
    // ========================================================================
    builder
      .addCase(fetchDepartmentRegistrations.pending, (state) => {
        state.isLoadingRegistrations = true;
        state.error = null;
      })
      .addCase(fetchDepartmentRegistrations.fulfilled, (state, action) => {
        state.isLoadingRegistrations = false;
        state.registrations = action.payload;
      })
      .addCase(fetchDepartmentRegistrations.rejected, (state, action) => {
        state.isLoadingRegistrations = false;
        state.error = action.payload || 'Failed to fetch registrations';
      });

    // ========================================================================
    // FETCH DEPARTMENT STUDENTS
    // ========================================================================
    builder
      .addCase(fetchDepartmentStudents.pending, (state) => {
        state.isLoadingStudents = true;
        state.error = null;
      })
      .addCase(fetchDepartmentStudents.fulfilled, (state, action) => {
        state.isLoadingStudents = false;
        state.students = action.payload;
      })
      .addCase(fetchDepartmentStudents.rejected, (state, action) => {
        state.isLoadingStudents = false;
        state.error = action.payload || 'Failed to fetch students';
      })
      .addCase(addDepartmentStudent.pending, (state) => {
        state.isAddingStudent = true;
        state.error = null;
      })
      .addCase(addDepartmentStudent.fulfilled, (state) => {
        state.isAddingStudent = false;
        // Refetch happens in the component; summary counts stay authoritative.
      })
      .addCase(addDepartmentStudent.rejected, (state, action) => {
        state.isAddingStudent = false;
        state.error = action.payload || 'Failed to add student';
      })
      .addCase(toggleDepartmentStudent.pending, (state) => {
        state.isTogglingStudent = true;
        state.error = null;
      })
      .addCase(toggleDepartmentStudent.fulfilled, (state, action) => {
        state.isTogglingStudent = false;
        // Update the row in place if the students list is loaded.
        if (state.students) {
          const index = state.students.data.findIndex((row) => row.id === action.payload.id);
          if (index !== -1) {
            state.students.data[index].isActive = action.payload.isActive;
          }
        }
      })
      .addCase(toggleDepartmentStudent.rejected, (state, action) => {
        state.isTogglingStudent = false;
        state.error = action.payload || 'Failed to update student status';
      });

    // ========================================================================
    // FETCH GROUP ADMINS
    // ========================================================================
    builder
      .addCase(fetchGroupAdmins.pending, (state) => {
        state.isLoadingGroupAdmins = true;
        state.error = null;
      })
      .addCase(fetchGroupAdmins.fulfilled, (state, action) => {
        state.isLoadingGroupAdmins = false;
        state.groupAdmins = action.payload.data;
        state.groupAdminsPagination = action.payload.pagination;
      })
      .addCase(fetchGroupAdmins.rejected, (state, action) => {
        state.isLoadingGroupAdmins = false;
        state.error = action.payload || 'Failed to fetch group admins';
      });

    // ========================================================================
    // FETCH GROUP ADMIN BY ID
    // ========================================================================
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

    // ========================================================================
    // ASSIGN GROUP ADMIN
    // ========================================================================
    builder
      .addCase(assignGroupAdmin.pending, (state) => {
        state.isAssigningAdmin = true;
        state.error = null;
      })
      .addCase(assignGroupAdmin.fulfilled, (state, action) => {
        state.isAssigningAdmin = false;
        // Add to group admins list
        state.groupAdmins.unshift(action.payload);
        // Update pagination total
        state.groupAdminsPagination.total += 1;
      })
      .addCase(assignGroupAdmin.rejected, (state, action) => {
        state.isAssigningAdmin = false;
        state.error = action.payload || 'Failed to assign group admin';
      });

    // ========================================================================
    // UPDATE GROUP ADMIN PERMISSIONS
    // ========================================================================
    builder
      .addCase(updateGroupAdminPermissions.pending, (state) => {
        state.isUpdatingPermissions = true;
        state.error = null;
      })
      .addCase(updateGroupAdminPermissions.fulfilled, (state, action) => {
        state.isUpdatingPermissions = false;
        
        // Update in group admins list
        const index = state.groupAdmins.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.groupAdmins[index] = action.payload;
        }
        
        // Update current group admin if it's the same one
        if (state.currentGroupAdmin?.id === action.payload.id) {
          state.currentGroupAdmin = action.payload;
        }
      })
      .addCase(updateGroupAdminPermissions.rejected, (state, action) => {
        state.isUpdatingPermissions = false;
        state.error = action.payload || 'Failed to update permissions';
      });

    // ========================================================================
    // REMOVE GROUP ADMIN
    // ========================================================================
    builder
      .addCase(removeGroupAdmin.pending, (state) => {
        state.isRemovingAdmin = true;
        state.error = null;
      })
      .addCase(removeGroupAdmin.fulfilled, (state, action) => {
        state.isRemovingAdmin = false;
        // Remove from group admins list
        state.groupAdmins = state.groupAdmins.filter(g => g.id !== action.payload);
        // Update pagination total
        state.groupAdminsPagination.total = Math.max(0, state.groupAdminsPagination.total - 1);
        // Clear current group admin if it was removed
        if (state.currentGroupAdmin?.id === action.payload) {
          state.currentGroupAdmin = null;
        }
      })
      .addCase(removeGroupAdmin.rejected, (state, action) => {
        state.isRemovingAdmin = false;
        state.error = action.payload || 'Failed to remove group admin';
      });

    // ========================================================================
    // TOGGLE GROUP ADMIN STATUS
    // ========================================================================
    builder
      .addCase(toggleGroupAdminStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleGroupAdminStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update in group admins list
        const index = state.groupAdmins.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.groupAdmins[index] = action.payload;
        }
        
        // Update current group admin if it's the same one
        if (state.currentGroupAdmin?.id === action.payload.id) {
          state.currentGroupAdmin = action.payload;
        }
      })
      .addCase(toggleGroupAdminStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to toggle status';
      });

    // ========================================================================
    // FETCH AVAILABLE PERMISSIONS
    // ========================================================================
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

// ============================================================================
// EXPORTS
// ============================================================================

export const {
  clearError,
  clearCurrentDepartment,
  clearCurrentGroupAdmin,
  clearGroupAdmins,
  clearAnalytics,
  clearRegistrations,
  clearStudents,
  setDepartmentError,
  resetDepartmentState,
} = departmentSlice.actions;

export default departmentSlice.reducer;