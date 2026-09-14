// import axiosInstance from './axios';
// import {
//   Department,
//   DepartmentsResponse,
//   CreateDepartmentRequest,
//   CreateDepartmentResponse,
//   UpdateDepartmentRequest,
//   DepartmentFilters,
//   GroupAdmin,
//   GroupAdminsResponse,
//   GroupAdminFilters,
//   AssignGroupAdminRequest,
//   UpdateGroupAdminPermissionsRequest,
//   PermissionDefinition,
//   DepartmentAnalytics,
// } from '@/lib/schema/department.schema';


// export const departmentApi = {

//   /**
//    * Get all departments with optional filters
//    */
//   async getDepartments(filters: DepartmentFilters): Promise<DepartmentsResponse> {
//     const params = new URLSearchParams();
    
//     if (filters.search) params.append('search', filters.search);
//     if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
//     params.append('page', String(filters.page));
//     params.append('limit', String(filters.limit));
//     params.append('sortBy', filters.sortBy);
//     params.append('sortOrder', filters.sortOrder);

//     const response = await axiosInstance.get<DepartmentsResponse>('/departments', { params });
//     return response.data;
//   },

//   /**
//    * Get department by ID
//    */
//   async getDepartmentById(id: string): Promise<Department> {
//     const response = await axiosInstance.get<Department>(`/departments/${id}`);
//     return response.data;
//   },

//   /**
//    * Create new department
//    */
//   async createDepartment(data: CreateDepartmentRequest): Promise<CreateDepartmentResponse> {
//     const response = await axiosInstance.post<CreateDepartmentResponse>('/departments', data);
//     return response.data;
//   },

//   /**
//    * Update department
//    */
//   async updateDepartment(id: string, data: UpdateDepartmentRequest): Promise<Department> {
//     const response = await axiosInstance.put<Department>(`/departments/${id}`, data);
//     return response.data;
//   },

//   /**
//    * Delete department
//    */
//   async deleteDepartment(id: string): Promise<void> {
//     await axiosInstance.delete(`/departments/${id}`);
//   },

//   /**
//    * Toggle department status
//    */
//   async toggleDepartmentStatus(id: string, isActive: boolean): Promise<Department> {
//     const response = await axiosInstance.patch<Department>(`/departments/${id}/status`, { isActive });
//     return response.data;
//   },

//   /**
//    * Get department analytics
//    */
//   async getDepartmentAnalytics(
//     id: string,
//     filters?: { startDate?: string; endDate?: string }
//   ): Promise<DepartmentAnalytics> {
//     const params = new URLSearchParams();
//     if (filters?.startDate) params.append('startDate', filters.startDate);
//     if (filters?.endDate) params.append('endDate', filters.endDate);

//     const response = await axiosInstance.get<DepartmentAnalytics>(
//       `/departments/${id}/analytics`,
//       { params }
//     );
//     return response.data;
//   },

//   // ==========================================================================
//   // GROUP ADMIN ENDPOINTS
//   // ==========================================================================

//   /**
//    * Get all group admins for a department
//    */
//   async getGroupAdmins(
//     departmentId: string,
//     filters?: Partial<GroupAdminFilters>
//   ): Promise<GroupAdminsResponse> {
//     const params = new URLSearchParams();
    
//     if (filters?.search) params.append('search', filters.search);
//     if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
//     if (filters?.page) params.append('page', String(filters.page));
//     if (filters?.limit) params.append('limit', String(filters.limit));

//     const response = await axiosInstance.get<GroupAdminsResponse>(
//       `/departments/${departmentId}/group-admins`,
//       { params }
//     );
//     return response.data;
//   },

//   /**
//    * Get group admin by ID
//    */
//   async getGroupAdminById(departmentId: string, groupAdminId: string): Promise<GroupAdmin> {
//     const response = await axiosInstance.get<GroupAdmin>(
//       `/departments/${departmentId}/group-admins/${groupAdminId}`
//     );
//     return response.data;
//   },

//   /**
//    * Assign user as group admin
//    */
//   async assignGroupAdmin(
//     departmentId: string,
//     data: AssignGroupAdminRequest
//   ): Promise<GroupAdmin> {
//     const response = await axiosInstance.post<GroupAdmin>(
//       `/departments/${departmentId}/group-admins`,
//       data
//     );
//     return response.data;
//   },

//   /**
//    * Update group admin permissions
//    */
//   async updateGroupAdminPermissions(
//     departmentId: string,
//     groupAdminId: string,
//     data: UpdateGroupAdminPermissionsRequest
//   ): Promise<GroupAdmin> {
//     const response = await axiosInstance.put<GroupAdmin>(
//       `/departments/${departmentId}/group-admins/${groupAdminId}/permissions`,
//       data
//     );
//     return response.data;
//   },

//   /**
//    * Remove group admin
//    */
//   async removeGroupAdmin(departmentId: string, groupAdminId: string): Promise<void> {
//     await axiosInstance.delete(`/departments/${departmentId}/group-admins/${groupAdminId}`);
//   },

//   /**
//    * Toggle group admin status
//    */
//   async toggleGroupAdminStatus(
//     departmentId: string,
//     groupAdminId: string,
//     isActive: boolean
//   ): Promise<GroupAdmin> {
//     const response = await axiosInstance.patch<GroupAdmin>(
//       `/departments/${departmentId}/group-admins/${groupAdminId}/status`,
//       { isActive }
//     );
//     return response.data;
//   },

//   // ==========================================================================
//   // PERMISSION ENDPOINTS
//   // ==========================================================================

//   /**
//    * Get available permissions
//    */
//   async getAvailablePermissions(): Promise<PermissionDefinition[]> {
//     const response = await axiosInstance.get<PermissionDefinition[]>('/departments/permissions');
//     return response.data;
//   },
// };