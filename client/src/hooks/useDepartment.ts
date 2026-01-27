// /**
//  * Reusable React hooks for department management:
//  * - Permission checking hooks
//  * - Department data fetching hooks
//  * - Group admin management hooks
//  * - Analytics hooks
//  * 
//  * @module hooks/useDepartment
//  * ============================================================================
//  */

// import { useEffect, useMemo, useCallback } from 'react';
// import { useAppDispatch, useAppSelector } from "@/store/hook";
// import {
//   fetchDepartments,
//   fetchDepartmentById,
//   fetchGroupAdmins,
//   fetchDepartmentAnalytics,
//   fetchAvailablePermissions,
// } from '@/store/slices/departmentSlice';
// import {
//   hasPermission,
//   hasAllPermissions,
//   canManageDepartment,
//   formatDepartmentStats,
// } from "@/services/department";
// import type { Permission } from "@/lib/types/common.types";
// import type {
//   Department,
//   GroupAdmin,
//   DepartmentFilters,
// } from "@/lib/types/department.types";

// // PERMISSION HOOKS

// /**
//  * Hook to check if current user has a specific permission
//  * 
//  * @param permission - Permission to check
//  * @returns Whether user has the permission
//  * 
//  * @example
//  * ```tsx
//  * function EventActions() {
//  *   const canDelete = useHasPermission(Permission.DELETE_EVENT);
//  *   
//  *   return canDelete ? <DeleteButton /> : null;
//  * }
//  * ```
//  */
// export function useHasPermission(permission: Permission): boolean {
//   const user = useAppSelector((state) => state.auth.user);
//   const groupAdmins = useAppSelector((state) => state.department.groupAdmins);

//   const groupAdmin = useMemo(() => {
//     if (!user) return null;
//     return groupAdmins.find((admin) => admin.userId === user.id) || null;
//   }, [user, groupAdmins]);

//   return hasPermission(user, permission, groupAdmin);
// }

// /**
//  * Hook to check if user has multiple permissions
//  * 
//  * @param permissions - Array of permissions to check
//  * @returns Whether user has all permissions
//  * 
//  * @example
//  * ```tsx
//  * const canManageEvents = useHasAllPermissions([
//  *   Permission.CREATE_EVENT,
//  *   Permission.DELETE_EVENT
//  * ]);
//  * ```
//  */
// export function useHasAllPermissions(permissions: Permission[]): boolean {
//   const user = useAppSelector((state) => state.auth.user);
//   const groupAdmins = useAppSelector((state) => state.department.groupAdmins);

//   const groupAdmin = useMemo(() => {
//     if (!user) return null;
//     return groupAdmins.find((admin) => admin.userId === user.id) || null;
//   }, [user, groupAdmins]);

//   return hasAllPermissions(user, permissions, groupAdmin);
// }

// /**
//  * Hook to get current user's permissions
//  * 
//  * @returns Array of user's permissions
//  * 
//  * @example
//  * ```tsx
//  * const permissions = useUserPermissions();
//  * console.log('User has permissions:', permissions);
//  * ```
//  */
// export function useUserPermissions(): Permission[] {
//   const user = useAppSelector((state) => state.auth.user);
//   const groupAdmins = useAppSelector((state) => state.department.groupAdmins);

//   return useMemo(() => {
//     if (!user) return [];
    
//     const groupAdmin = groupAdmins.find((admin) => admin.userId === user.id);
//     return groupAdmin?.permissions || [];
//   }, [user, groupAdmins]);
// }

// // DEPARTMENT DATA HOOKS

// /**
//  * Hook to fetch and access departments list
//  * 
//  * @param filters - Optional filters
//  * @param autoFetch - Whether to fetch automatically on mount
//  * @returns Departments data and loading state
//  * 
//  * @example
//  * ```tsx
//  * function DepartmentsList() {
//  *   const { departments, isLoading, refetch } = useDepartments({
//  *     isActive: true
//  *   });
//  *   
//  *   return (
//  *     <div>
//  *       {isLoading ? 'Loading...' : departments.map(...)}
//  *     </div>
//  *   );
//  * }
//  * ```
//  */
// export function useDepartments(
//   filters?: DepartmentFilters,
//   autoFetch: boolean = true
// ) {
//   const dispatch = useAppDispatch();
//   const {
//     departments,
//     isLoading,
//     error,
//     departmentsPagination,
//   } = useAppSelector((state) => state.department);

//   useEffect(() => {
//     if (autoFetch) {
//       dispatch(fetchDepartments(filters));
//     }
//   }, [dispatch, autoFetch, JSON.stringify(filters)]);

//   const refetch = useCallback(() => {
//     dispatch(fetchDepartments(filters));
//   }, [dispatch, filters]);

//   return {
//     departments,
//     isLoading,
//     error,
//     pagination: departmentsPagination,
//     refetch,
//   };
// }

// /**
//  * Hook to fetch and access a single department
//  * 
//  * @param departmentId - Department ID
//  * @param autoFetch - Whether to fetch automatically on mount
//  * @returns Department data and loading state
//  * 
//  * @example
//  * ```tsx
//  * function DepartmentDetails({ id }: { id: string }) {
//  *   const { department, isLoading } = useDepartment(id);
//  *   
//  *   if (!department) return null;
//  *   
//  *   return <div>{department.name}</div>;
//  * }
//  * ```
//  */
// export function useDepartment(
//   departmentId: string | undefined,
//   autoFetch: boolean = true
// ) {
//   const dispatch = useAppDispatch();
//   const { currentDepartment, isLoading, error } = useAppSelector(
//     (state) => state.department
//   );

//   useEffect(() => {
//     if (autoFetch && departmentId) {
//       dispatch(fetchDepartmentById(departmentId));
//     }
//   }, [dispatch, departmentId, autoFetch]);

//   const refetch = useCallback(() => {
//     if (departmentId) {
//       dispatch(fetchDepartmentById(departmentId));
//     }
//   }, [dispatch, departmentId]);

//   const stats = useMemo(() => {
//     return currentDepartment ? formatDepartmentStats(currentDepartment) : null;
//   }, [currentDepartment]);

//   return {
//     department: currentDepartment,
//     isLoading,
//     error,
//     stats,
//     refetch,
//   };
// }

// /**
//  * Hook to get current user's department
//  * 
//  * @returns Current user's department
//  * 
//  * @example
//  * ```tsx
//  * function MyDepartment() {
//  *   const { department, isLoading } = useCurrentDepartment();
//  *   
//  *   return <div>{department?.name}</div>;
//  * }
//  * ```
//  */
// export function useCurrentDepartment() {
//   const user = useAppSelector((state) => state.auth.user);
//   const departmentId = user?.departmentId;

//   return useDepartment(departmentId, !!departmentId);
// }

// /**
//  * Hook to check if user can manage a department
//  * 
//  * @param departmentId - Department ID to check
//  * @returns Whether user can manage the department
//  * 
//  * @example
//  * ```tsx
//  * function DepartmentSettings({ deptId }: { deptId: string }) {
//  *   const canManage = useCanManageDepartment(deptId);
//  *   
//  *   if (!canManage) return <div>Access Denied</div>;
//  *   
//  *   return <SettingsForm />;
//  * }
//  * ```
//  */
// export function useCanManageDepartment(departmentId: string): boolean {
//   const user = useAppSelector((state) => state.auth.user);
  
//   return useMemo(() => {
//     return canManageDepartment(user, departmentId);
//   }, [user, departmentId]);
// }

// // GROUP ADMIN HOOKS

// /**
//  * Hook to fetch and access group admins for a department
//  * 
//  * @param departmentId - Department ID
//  * @param autoFetch - Whether to fetch automatically on mount
//  * @returns Group admins data and loading state
//  * 
//  * @example
//  * ```tsx
//  * function GroupAdminsList({ deptId }: { deptId: string }) {
//  *   const { groupAdmins, isLoading } = useGroupAdmins(deptId);
//  *   
//  *   return (
//  *     <div>
//  *       {groupAdmins.map(admin => <AdminCard key={admin.id} {...admin} />)}
//  *     </div>
//  *   );
//  * }
//  * ```
//  */
// export function useGroupAdmins(
//   departmentId: string | undefined,
//   autoFetch: boolean = true
// ) {
//   const dispatch = useAppDispatch();
//   const {
//     groupAdmins,
//     isLoading,
//     error,
//     groupAdminsPagination,
//   } = useAppSelector((state) => state.department);

//   useEffect(() => {
//     if (autoFetch && departmentId) {
//       dispatch(fetchGroupAdmins({ departmentId }));
//     }
//   }, [dispatch, departmentId, autoFetch]);

//   const refetch = useCallback(() => {
//     if (departmentId) {
//       dispatch(fetchGroupAdmins({ departmentId }));
//     }
//   }, [dispatch, departmentId]);

//   const activeAdmins = useMemo(() => {
//     return groupAdmins.filter((admin) => admin.isActive);
//   }, [groupAdmins]);

//   const inactiveAdmins = useMemo(() => {
//     return groupAdmins.filter((admin) => !admin.isActive);
//   }, [groupAdmins]);

//   return {
//     groupAdmins,
//     activeAdmins,
//     inactiveAdmins,
//     isLoading,
//     error,
//     pagination: groupAdminsPagination,
//     refetch,
//   };
// }

// /**
//  * Hook to check if current user is a group admin
//  * 
//  * @returns Group admin data if user is a group admin
//  * 
//  * @example
//  * ```tsx
//  * function GroupAdminDashboard() {
//  *   const groupAdmin = useIsGroupAdmin();
//  *   
//  *   if (!groupAdmin) return <div>Not a group admin</div>;
//  *   
//  *   return <Dashboard admin={groupAdmin} />;
//  * }
//  * ```
//  */
// export function useIsGroupAdmin(): GroupAdmin | null {
//   const user = useAppSelector((state) => state.auth.user);
//   const groupAdmins = useAppSelector((state) => state.department.groupAdmins);

//   return useMemo(() => {
//     if (!user) return null;
//     return groupAdmins.find((admin) => admin.userId === user.id) || null;
//   }, [user, groupAdmins]);
// }

// // ANALYTICS HOOKS

// /**
//  * Hook to fetch and access department analytics
//  * 
//  * @param departmentId - Department ID
//  * @param autoFetch - Whether to fetch automatically on mount
//  * @returns Analytics data and loading state
//  * 
//  * @example
//  * ```tsx
//  * function AnalyticsDashboard({ deptId }: { deptId: string }) {
//  *   const { analytics, isLoading } = useDepartmentAnalytics(deptId);
//  *   
//  *   if (!analytics) return null;
//  *   
//  *   return (
//  *     <div>
//  *       <h2>Total Events: {analytics.overview.totalEvents}</h2>
//  *     </div>
//  *   );
//  * }
//  * ```
//  */
// export function useDepartmentAnalytics(
//   departmentId: string | undefined,
//   autoFetch: boolean = true
// ) {
//   const dispatch = useAppDispatch();
//   const { analytics, isLoadingAnalytics, error } = useAppSelector(
//     (state) => state.department
//   );

//   useEffect(() => {
//     if (autoFetch && departmentId) {
//       dispatch(fetchDepartmentAnalytics({ departmentId }));
//     }
//   }, [dispatch, departmentId, autoFetch]);

//   const refetch = useCallback(
//     (filters?: any) => {
//       if (departmentId) {
//         dispatch(fetchDepartmentAnalytics({ departmentId, filters }));
//       }
//     },
//     [dispatch, departmentId]
//   );

//   const topEvents = useMemo(() => {
//     return analytics?.topPerformers.events.slice(0, 5) || [];
//   }, [analytics]);

//   const topGroupAdmins = useMemo(() => {
//     return analytics?.topPerformers.groupAdmins.slice(0, 5) || [];
//   }, [analytics]);

//   return {
//     analytics,
//     isLoading: isLoadingAnalytics,
//     error,
//     topEvents,
//     topGroupAdmins,
//     refetch,
//   };
// }

// // PERMISSIONS METADATA HOOK

// /**
//  * Hook to fetch available permissions
//  * 
//  * @returns Available permissions with metadata
//  * 
//  * @example
//  * ```tsx
//  * function PermissionSelector() {
//  *   const { permissions, isLoading } = useAvailablePermissions();
//  *   
//  *   return (
//  *     <div>
//  *       {permissions.map(perm => (
//  *         <Checkbox key={perm.key} label={perm.name} />
//  *       ))}
//  *     </div>
//  *   );
//  * }
//  * ```
//  */
// export function useAvailablePermissions() {
//   const dispatch = useAppDispatch();
//   const { availablePermissions, isLoading, error } = useAppSelector(
//     (state) => state.department
//   );

//   useEffect(() => {
//     if (availablePermissions.length === 0) {
//       dispatch(fetchAvailablePermissions());
//     }
//   }, [dispatch, availablePermissions.length]);

//   const permissionsByCategory = useMemo(() => {
//     return availablePermissions.reduce((acc, perm) => {
//       if (!acc[perm.category]) {
//         acc[perm.category] = [];
//       }
//       acc[perm.category].push(perm);
//       return acc;
//     }, {} as Record<string, typeof availablePermissions>);
//   }, [availablePermissions]);

//   return {
//     permissions: availablePermissions,
//     permissionsByCategory,
//     isLoading,
//     error,
//   };
// }

// // EXPORT ALL HOOKS

// export const departmentHooks = {
//   // Permissions
//   useHasPermission,
//   useHasAllPermissions,
//   useUserPermissions,
  
//   // Departments
//   useDepartments,
//   useDepartment,
//   useCurrentDepartment,
//   useCanManageDepartment,
  
//   // Group Admins
//   useGroupAdmins,
//   useIsGroupAdmin,
  
//   // Analytics
//   useDepartmentAnalytics,
  
//   // Permissions Metadata
//   useAvailablePermissions,
// };