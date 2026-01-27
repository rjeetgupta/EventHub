import axiosInstance, { handleApiError } from "@/api/axios";
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
import type { ApiResponse } from "@/lib/types/common.types";


/**
 * Fetch all departments with optional filtering
 * 
 * @param filters - Optional filters (search, active status, pagination)
 * @returns Paginated departments response
 * @throws Error if fetch fails
 * 
 * @example
 * ```ts
 * const response = await departmentApi.getDepartments({
 *   isActive: true,
 *   page: 1,
 *   limit: 10
 * });
 * ```
 */
export const getDepartments = async (
  filters?: DepartmentFilters
): Promise<DepartmentsResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<DepartmentsResponse>>(
      '/departments',
      { params: filters }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch departments');
    }
    console.log("ALL DEPARTMENT : ", response.data.data)
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single department by ID
 * 
 * @param id - Department ID
 * @returns Department object with stats
 * @throws Error if department not found or fetch fails
 * 
 * @example
 * ```ts
 * const department = await departmentApi.getDepartmentById('dept-123');
 * ```
 */
export const getDepartmentById = async (id: string): Promise<Department> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Department>>(
      `/departments/${id}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Department not found');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Create new department (Super Admin only)
 * 
 * @param data - Department creation data
 * @returns Created department object
 * @throws Error if creation fails or unauthorized
 * 
 * @example
 * ```ts
 * const department = await departmentApi.createDepartment({
 *   name: 'Computer Science',
 *   code: 'BTECH',
 *   description: 'Bachelor of Technology',
 *   color: '#3b82f6'
 * });
 * ```
 */
export const createDepartment = async (
  data: CreateDepartmentRequest
): Promise<Department> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Department>>(
      '/departments',
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to create department');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update existing department (Super Admin or Department Admin)
 * 
 * @param id - Department ID
 * @param data - Fields to update
 * @returns Updated department object
 * @throws Error if update fails or unauthorized
 * 
 * @example
 * ```ts
 * const updated = await departmentApi.updateDepartment('dept-123', {
 *   description: 'Updated description',
 *   settings: {
 *     requireEventApproval: true
 *   }
 * });
 * ```
 */
export const updateDepartment = async (
  id: string,
  data: UpdateDepartmentRequest
): Promise<Department> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Department>>(
      `/departments/${id}`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update department');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete department (Super Admin only)
 * 
 * @param id - Department ID
 * @throws Error if deletion fails or unauthorized
 * 
 * @example
 * ```ts
 * await departmentApi.deleteDepartment('dept-123');
 * ```
 */
export const deleteDepartment = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete<ApiResponse>(
      `/departments/${id}`
    );

    if (!response.data.success) {
      throw new Error('Failed to delete department');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Toggle department active status (Super Admin only)
 * 
 * @param id - Department ID
 * @param isActive - New active status
 * @returns Updated department
 * @throws Error if update fails
 * 
 * @example
 * ```ts
 * await departmentApi.toggleDepartmentStatus('dept-123', false);
 * ```
 */
export const toggleDepartmentStatus = async (
  id: string,
  isActive: boolean
): Promise<Department> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<Department>>(
      `/departments/${id}/status`,
      { isActive }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update department status');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// GROUP ADMIN MANAGEMENT
// ============================================================================

/**
 * Get all group admins for a department
 * 
 * @param departmentId - Department ID
 * @param filters - Optional filters
 * @returns Paginated group admins response
 * @throws Error if fetch fails
 * 
 * @example
 * ```ts
 * const response = await departmentApi.getGroupAdmins('dept-123', {
 *   isActive: true,
 *   page: 1
 * });
 * ```
 */
export const getGroupAdmins = async (
  departmentId: string,
  filters?: GroupAdminFilters
): Promise<GroupAdminsResponse> => {
  try {
    const response = await axiosInstance.get<ApiResponse<GroupAdminsResponse>>(
      `/departments/${departmentId}/group-admins`,
      { params: filters }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch group admins');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single group admin details
 * 
 * @param departmentId - Department ID
 * @param groupAdminId - Group admin ID
 * @returns Group admin object with stats
 * @throws Error if not found or fetch fails
 * 
 * @example
 * ```ts
 * const admin = await departmentApi.getGroupAdminById('dept-123', 'admin-456');
 * ```
 */
export const getGroupAdminById = async (
  departmentId: string,
  groupAdminId: string
): Promise<GroupAdmin> => {
  try {
    const response = await axiosInstance.get<ApiResponse<GroupAdmin>>(
      `/departments/${departmentId}/group-admins/${groupAdminId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Group admin not found');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Assign a user as group admin (Department Admin only)
 * 
 * Creates a group admin role for a student with specified permissions.
 * 
 * @param departmentId - Department ID
 * @param data - User ID and permissions
 * @returns Created group admin object
 * @throws Error if assignment fails or unauthorized
 * 
 * @example
 * ```ts
 * const admin = await departmentApi.assignGroupAdmin('dept-123', {
 *   userId: 'user-789',
 *   permissions: [
 *     Permission.CREATE_EVENT,
 *     Permission.UPDATE_EVENT,
 *     Permission.MARK_ATTENDANCE
 *   ]
 * });
 * ```
 */
export const assignGroupAdmin = async (
  departmentId: string,
  data: AssignGroupAdminRequest
): Promise<GroupAdmin> => {
  try {
    const response = await axiosInstance.post<ApiResponse<GroupAdmin>>(
      `/departments/${departmentId}/group-admins`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to assign group admin');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update group admin permissions (Department Admin only)
 * 
 * @param departmentId - Department ID
 * @param groupAdminId - Group admin ID
 * @param data - New permissions
 * @returns Updated group admin object
 * @throws Error if update fails or unauthorized
 * 
 * @example
 * ```ts
 * const updated = await departmentApi.updateGroupAdminPermissions(
 *   'dept-123',
 *   'admin-456',
 *   {
 *     permissions: [
 *       Permission.CREATE_EVENT,
 *       Permission.UPDATE_EVENT,
 *       Permission.DELETE_EVENT,
 *       Permission.PUBLISH_EVENT
 *     ]
 *   }
 * );
 * ```
 */
export const updateGroupAdminPermissions = async (
  departmentId: string,
  groupAdminId: string,
  data: UpdateGroupAdminPermissionsRequest
): Promise<GroupAdmin> => {
  try {
    const response = await axiosInstance.put<ApiResponse<GroupAdmin>>(
      `/departments/${departmentId}/group-admins/${groupAdminId}/permissions`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update permissions');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Remove group admin role (Department Admin only)
 * 
 * Revokes group admin privileges from a user.
 * 
 * @param departmentId - Department ID
 * @param groupAdminId - Group admin ID
 * @throws Error if removal fails or unauthorized
 * 
 * @example
 * ```ts
 * await departmentApi.removeGroupAdmin('dept-123', 'admin-456');
 * ```
 */
export const removeGroupAdmin = async (
  departmentId: string,
  groupAdminId: string
): Promise<void> => {
  try {
    const response = await axiosInstance.delete<ApiResponse>(
      `/departments/${departmentId}/group-admins/${groupAdminId}`
    );

    if (!response.data.success) {
      throw new Error('Failed to remove group admin');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Toggle group admin active status (Department Admin only)
 * 
 * @param departmentId - Department ID
 * @param groupAdminId - Group admin ID
 * @param isActive - New active status
 * @returns Updated group admin
 * @throws Error if update fails
 * 
 * @example
 * ```ts
 * await departmentApi.toggleGroupAdminStatus('dept-123', 'admin-456', false);
 * ```
 */
export const toggleGroupAdminStatus = async (
  departmentId: string,
  groupAdminId: string,
  isActive: boolean
): Promise<GroupAdmin> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<GroupAdmin>>(
      `/departments/${departmentId}/group-admins/${groupAdminId}/status`,
      { isActive }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update group admin status');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// PERMISSIONS MANAGEMENT
// ============================================================================

/**
 * Get available permissions list
 * 
 * Returns all permissions that can be assigned to group admins.
 * 
 * @returns Array of permission definitions
 * @throws Error if fetch fails
 * 
 * @example
 * ```ts
 * const permissions = await departmentApi.getAvailablePermissions();
 * ```
 */
export const getAvailablePermissions = async (): Promise<PermissionDefinition[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<PermissionDefinition[]>>(
      '/departments/permissions'
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch permissions');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Validate permissions for a role
 * 
 * Checks if given permissions are valid for a specific role.
 * 
 * @param userId - User ID to check
 * @param permissions - Permissions to validate
 * @returns Validation result
 * @throws Error if validation fails
 * 
 * @example
 * ```ts
 * const isValid = await departmentApi.validatePermissions('user-123', [
 *   Permission.CREATE_EVENT,
 *   Permission.DELETE_EVENT
 * ]);
 * ```
 */
export const validatePermissions = async (
  userId: string,
  permissions: string[]
): Promise<{ valid: boolean; invalidPermissions: string[] }> => {
  try {
    const response = await axiosInstance.post<ApiResponse<{
      valid: boolean;
      invalidPermissions: string[];
    }>>(
      '/departments/permissions/validate',
      { userId, permissions }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to validate permissions');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

/**
 * Get department analytics
 * 
 * Returns comprehensive analytics and statistics for a department.
 * 
 * @param departmentId - Department ID
 * @param filters - Optional date range and filters
 * @returns Department analytics data
 * @throws Error if fetch fails
 * 
 * @example
 * ```ts
 * const analytics = await departmentApi.getDepartmentAnalytics('dept-123', {
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 * ```
 */
export const getDepartmentAnalytics = async (
  departmentId: string,
  filters?: DepartmentAnalyticsFilters
): Promise<DepartmentAnalytics> => {
  try {
    const response = await axiosInstance.get<ApiResponse<DepartmentAnalytics>>(
      `/departments/${departmentId}/analytics`,
      { params: filters }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch analytics');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Export department analytics report
 * 
 * Downloads analytics report as PDF or Excel.
 * 
 * @param departmentId - Department ID
 * @param format - Export format ('pdf' | 'excel')
 * @param filters - Optional filters
 * @returns Blob for download
 * @throws Error if export fails
 * 
 * @example
 * ```ts
 * const blob = await departmentApi.exportAnalytics('dept-123', 'pdf', {
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31'
 * });
 * 
 * // Trigger download
 * const url = URL.createObjectURL(blob);
 * const a = document.createElement('a');
 * a.href = url;
 * a.download = 'analytics.pdf';
 * a.click();
 * ```
 */
export const exportAnalytics = async (
  departmentId: string,
  format: 'pdf' | 'excel',
  filters?: DepartmentAnalyticsFilters
): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(
      `/departments/${departmentId}/analytics/export`,
      {
        params: { ...filters, format },
        responseType: 'blob',
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get department performance comparison
 * 
 * Compares performance metrics with other departments.
 * 
 * @param departmentId - Department ID
 * @param comparisonPeriod - Period for comparison ('month' | 'quarter' | 'year')
 * @returns Comparison data
 * @throws Error if fetch fails
 * 
 * @example
 * ```ts
 * const comparison = await departmentApi.getDepartmentComparison('dept-123', 'quarter');
 * ```
 */
export const getDepartmentComparison = async (
  departmentId: string,
  comparisonPeriod: 'month' | 'quarter' | 'year'
): Promise<{
  currentDepartment: DepartmentAnalytics['overview'];
  averageAcrossAll: DepartmentAnalytics['overview'];
  ranking: number;
  totalDepartments: number;
}> => {
  try {
    const response = await axiosInstance.get<ApiResponse<any>>(
      `/departments/${departmentId}/analytics/comparison`,
      { params: { period: comparisonPeriod } }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch comparison data');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// EXPORT ALL METHODS AS OBJECT
// ============================================================================

export const departmentApi = {
  // Department Management
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentStatus,
  
  // Group Admin Management
  getGroupAdmins,
  getGroupAdminById,
  assignGroupAdmin,
  updateGroupAdminPermissions,
  removeGroupAdmin,
  toggleGroupAdminStatus,
  
  // Permissions
  getAvailablePermissions,
  validatePermissions,
  
  // Analytics
  getDepartmentAnalytics,
  exportAnalytics,
  getDepartmentComparison,
};