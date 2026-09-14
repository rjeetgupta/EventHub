import axiosInstance from '@/api/axios';
import {
  DepartmentFiltersSchema,
  CreateDepartmentRequestSchema,
  UpdateDepartmentRequestSchema,
  AssignGroupAdminRequestSchema,
  UpdateGroupAdminPermissionsRequestSchema,
  GroupAdminFiltersSchema,
  validatePermissions,
  type DepartmentFilters,
  type CreateDepartmentRequest,
  type UpdateDepartmentRequest,
  type AssignGroupAdminRequest,
  type UpdateGroupAdminPermissionsRequest,
  type GroupAdminFilters,
  type Department,
  type GroupAdmin,
  type PermissionDefinition,
  type DepartmentsResponse,
  type GroupAdminsResponse,
  type CreateDepartmentResponse,
  type DepartmentAnalytics,
} from '@/lib/schema/department.schema';
import { ApiResponse } from '@/lib/types/common.types';

class DepartmentService {
  private readonly endpoint = '/departments';

  /**
   * Get all departments with optional filters
   */
  async getDepartments(filters?: Partial<DepartmentFilters>): Promise<DepartmentsResponse> {
    try {
      const params = new URLSearchParams();
      
      // Only add params if they are explicitly provided
      if (filters?.search) params.append('search', filters.search);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosInstance.get<ApiResponse<DepartmentsResponse>>(
        this.endpoint,
        { params: params.toString() ? params : undefined } // Only send params if there are any
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch departments');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch departments');
    }
  }

  /**
   * Get department by ID
   */
  async getDepartmentById(id: string): Promise<Department> {
    try {
      const response = await axiosInstance.get<ApiResponse<Department>>(
        `${this.endpoint}/${id}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch department');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch department');
    }
  }

  /**
   * Create new department
   */
  async createDepartment(data: CreateDepartmentRequest): Promise<CreateDepartmentResponse> {
    try {
      // Validate input
      const validatedData = CreateDepartmentRequestSchema.parse(data);

      const response = await axiosInstance.post<ApiResponse<CreateDepartmentResponse>>(
        this.endpoint,
        validatedData
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to create department');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create department');
    }
  }

  /**
   * Update department
   */
  async updateDepartment(id: string, data: UpdateDepartmentRequest): Promise<Department> {
    try {
      // Validate input
      const validatedData = UpdateDepartmentRequestSchema.parse(data);

      const response = await axiosInstance.put<ApiResponse<Department>>(
        `${this.endpoint}/${id}`,
        validatedData
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to update department');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update department');
    }
  }

  /**
   * Delete department
   */
  async deleteDepartment(id: string): Promise<void> {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `${this.endpoint}/${id}`
      );

      if (response.data.success) {
        return;
      }

      throw new Error(response.data.message || 'Failed to delete department');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete department');
    }
  }

  /**
   * Toggle department status
   */
  async toggleDepartmentStatus(id: string, isActive: boolean): Promise<Department> {
    try {
      const response = await axiosInstance.patch<ApiResponse<Department>>(
        `${this.endpoint}/${id}/status`,
        { isActive }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to toggle status');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to toggle status');
    }
  }

  /**
   * Get department analytics
   */
  async getDepartmentAnalytics(
    id: string,
    filters?: { startDate?: string; endDate?: string }
  ): Promise<DepartmentAnalytics> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await axiosInstance.get<ApiResponse<DepartmentAnalytics>>(
        `${this.endpoint}/${id}/analytics`,
        { params: params.toString() ? params : undefined }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch analytics');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch analytics');
    }
  }

  // ============================================================================
  // GROUP ADMIN OPERATIONS
  // ============================================================================

  /**
   * Get all group admins for a department
   */
  async getGroupAdmins(
    departmentId: string,
    filters?: Partial<GroupAdminFilters>
  ): Promise<GroupAdminsResponse> {
    try {
      const params = new URLSearchParams();
      
      // Only add params if they are explicitly provided
      if (filters?.search) params.append('search', filters.search);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await axiosInstance.get<ApiResponse<GroupAdminsResponse>>(
        `${this.endpoint}/${departmentId}/group-admins`,
        { params: params.toString() ? params : undefined }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch group admins');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch group admins');
    }
  }

  /**
   * Get group admin by ID
   */
  async getGroupAdminById(departmentId: string, groupAdminId: string): Promise<GroupAdmin> {
    try {
      const response = await axiosInstance.get<ApiResponse<GroupAdmin>>(
        `${this.endpoint}/${departmentId}/group-admins/${groupAdminId}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch group admin');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch group admin');
    }
  }

  /**
   * Assign user as group admin
   */
  async assignGroupAdmin(
    departmentId: string,
    data: AssignGroupAdminRequest
  ): Promise<GroupAdmin> {
    try {
      // Validate input
      const validatedData = AssignGroupAdminRequestSchema.parse(data);

      // Validate permissions consistency
      validatePermissions(validatedData.permissions);

      const response = await axiosInstance.post<ApiResponse<GroupAdmin>>(
        `${this.endpoint}/${departmentId}/group-admins`,
        validatedData
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to assign group admin');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to assign group admin');
    }
  }

  /**
   * Update group admin permissions
   */
  async updateGroupAdminPermissions(
    departmentId: string,
    groupAdminId: string,
    data: UpdateGroupAdminPermissionsRequest
  ): Promise<GroupAdmin> {
    try {
      // Validate input
      const validatedData = UpdateGroupAdminPermissionsRequestSchema.parse(data);

      // Validate permissions consistency
      validatePermissions(validatedData.permissions);

      const response = await axiosInstance.put<ApiResponse<GroupAdmin>>(
        `${this.endpoint}/${departmentId}/group-admins/${groupAdminId}/permissions`,
        validatedData
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to update permissions');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update permissions');
    }
  }

  /**
   * Remove group admin
   */
  async removeGroupAdmin(departmentId: string, groupAdminId: string): Promise<void> {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(
        `${this.endpoint}/${departmentId}/group-admins/${groupAdminId}`
      );

      if (response.data.success) {
        return;
      }

      throw new Error(response.data.message || 'Failed to remove group admin');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to remove group admin');
    }
  }

  /**
   * Toggle group admin status
   */
  async toggleGroupAdminStatus(
    departmentId: string,
    groupAdminId: string,
    isActive: boolean
  ): Promise<GroupAdmin> {
    try {
      const response = await axiosInstance.patch<ApiResponse<GroupAdmin>>(
        `${this.endpoint}/${departmentId}/group-admins/${groupAdminId}/status`,
        { isActive }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to toggle status');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to toggle status');
    }
  }

  // ============================================================================
  // PERMISSION OPERATIONS
  // ============================================================================

  /**
   * Get available permissions
   */
  async getAvailablePermissions(): Promise<PermissionDefinition[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<PermissionDefinition[]>>(
        `${this.endpoint}/permissions`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch permissions');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch permissions');
    }
  }
}

// EXPORT SINGLETON INSTANCE
export const departmentService = new DepartmentService();