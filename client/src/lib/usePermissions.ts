// import { useMemo } from 'react';
// import { User } from './types/user.types';

// import {
//   UserPermissions,
//   StudentPermissions,
//   GroupAdminPermissions,
//   DeptAdminPermissions,
//   AdminPermissions,
//   ROLE_FEATURE_FLAGS,
//   PermissionCheckResult,
// } from '@/types/service';
// import { UserRole } from './types/common.types';

// // ============ PERMISSION DEFINITION ============

// const PERMISSIONS_BY_ROLE = {
//   student: {
//     canRegisterEvents: true,
//     canViewOwnEvents: true,
//     canDownloadCertificates: true,
//   } as StudentPermissions,

//   groupAdmin: {
//     canCreateEvents: true,
//     canEditOwnEvents: true,
//     canDeleteOwnEvents: true,
//     canSubmitForApproval: true,
//     canViewAnalytics: true,
//   } as GroupAdminPermissions,

//   deptAdmin: {
//     canApproveEvents: true,
//     canRejectEvents: true,
//     canViewDepartmentAnalytics: true,
//     canManageDepartmentUsers: true,
//     canViewAllEvents: true,
//   } as DeptAdminPermissions,

//   admin: {
//     canManageAllRoles: true,
//     canViewGlobalAnalytics: true,
//     canManageDepartments: true,
//     canApproveAllEvents: true,
//   } as AdminPermissions,
// } as const;

// // ============ ROLE-BASED HOOKS ============

// /**
//  * Hook to get user permissions based on their role
//  */
// export function useUserPermissions(user: User | null): UserPermissions | null {
//   return useMemo(() => {
//     if (!user) return null;

//     const rolePermissions = PERMISSIONS_BY_ROLE[user.role as UserRole];
//     return { ...rolePermissions, role: user.role as RoleUserRole } as UserPermissions;
//   }, [user]);
// }

// /**
//  * Hook to check if user has a specific permission
//  */
// export function useHasPermission(
//   user: User | null,
//   permissionKey: string
// ): boolean {
//   const permissions = useUserPermissions(user);
//   return useMemo(() => {
//     if (!permissions) return false;
//     return (permissions as any)[permissionKey] === true;
//   }, [permissions, permissionKey]);
// }

// /**
//  * Hook to check if user has any of the specified roles
//  */
// export function useHasRole(user: User | null, roles: Role[]): boolean {
//   return useMemo(() => {
//     if (!user) return false;
//     return roles.includes(user.role as Role);
//   }, [user, roles]);
// }

// /**
//  * Hook to get user's allowed routes based on role
//  */
// export function useAllowedRoutes(user: User | null) {
//   return useMemo(() => {
//     if (!user) return [];

//     const routes: string[] = [];
//     const flags = ROLE_FEATURE_FLAGS[user.role as Role];

//     // Base routes for all authenticated users
//     routes.push('/dashboard/overview');
//     routes.push('/my-events');

//     if (flags.eventManagement) {
//       routes.push('/dashboard/events');
//       routes.push('/dashboard/events/create');
//     }

//     if (flags.approvals) {
//       routes.push('/dashboard/approvals');
//     }

//     if (flags.analytics) {
//       routes.push('/dashboard/analytics');
//     }

//     if (flags.userManagement) {
//       routes.push('/dashboard/users');
//     }

//     if (user.role === 'admin') {
//       routes.push('/admin');
//     }

//     return routes;
//   }, [user]);
// }

// /**
//  * Hook to get feature flags for current role
//  */
// export function useFeatureFlags(user: User | null) {
//   return useMemo(() => {
//     if (!user) {
//       return {
//         eventManagement: false,
//         approvals: false,
//         analytics: false,
//         userManagement: false,
//       };
//     }
//     return ROLE_FEATURE_FLAGS[user.role as Role];
//   }, [user]);
// }

// /**
//  * Hook to check permission with detailed result
//  */
// export function useCheckPermission(
//   user: User | null,
//   permissionKey: string
// ): PermissionCheckResult {
//   return useMemo(() => {
//     if (!user) {
//       return {
//         hasPermission: false,
//         reason: 'User not authenticated',
//       };
//     }

//     const permissions = PERMISSIONS_BY_ROLE[user.role as Role];
//     const hasPermission = (permissions as any)[permissionKey] === true;

//     return {
//       hasPermission,
//       reason: hasPermission
//         ? undefined
//         : `Permission '${permissionKey}' not available for ${user.role} role`,
//     };
//   }, [user, permissionKey]);
// }

// /**
//  * Hook to get all permissions for user's role
//  */
// export function useAllPermissions(user: User | null): Record<string, boolean> {
//   return useMemo(() => {
//     if (!user) return {};
//     return PERMISSIONS_BY_ROLE[user.role as Role];
//   }, [user]);
// }

// // ============ RESOURCE-BASED ACCESS CONTROL ============

// /**
//  * Hook to check if user can edit an event (role & ownership based)
//  * DeptAdmin can edit any event in their department
//  */
// export function useCanEditEvent(
//   user: User | null,
//   eventOwnerId?: string
// ): boolean {
//   return useMemo(() => {
//     if (!user) return false;

//     // Admin can edit any event
//     if (user.role === 'admin') return true;

//     // DeptAdmin can edit all events (in their department context)
//     if (user.role === 'deptAdmin') return true;

//     // GroupAdmin can only edit their own events
//     if (user.role === 'groupAdmin') {
//       return user.id === eventOwnerId;
//     }

//     return false;
//   }, [user, eventOwnerId]);
// }

// /**
//  * Hook to check if user can approve an event (role based)
//  */
// export function useCanApproveEvent(user: User | null): boolean {
//   return useMemo(() => {
//     if (!user) return false;
//     return ['deptAdmin', 'admin'].includes(user.role);
//   }, [user]);
// }

// /**
//  * Hook to check if user can create events
//  */
// export function useCanCreateEvents(user: User | null): boolean {
//   return useMemo(() => {
//     if (!user) return false;
//     return ['groupAdmin', 'admin'].includes(user.role);
//   }, [user]);
// }

// /**
//  * Hook to check if user can view analytics
//  */
// export function useCanViewAnalytics(user: User | null): boolean {
//   return useMemo(() => {
//     if (!user) return false;
//     return ['groupAdmin', 'deptAdmin', 'admin'].includes(user.role);
//   }, [user]);
// }

// /**
//  * Hook to check if user can manage users
//  */
// export function useCanManageUsers(user: User | null): boolean {
//   return useMemo(() => {
//     if (!user) return false;
//     return ['deptAdmin', 'admin'].includes(user.role);
//   }, [user]);
// }

// // ============ DATA FILTERING HELPERS ============

// /**
//  * Filter events based on user role and permissions
//  */
// export function useFilterEventsByRole(
//   user: User | null,
//   events: any[]
// ): any[] {
//   return useMemo(() => {
//     if (!user || events.length === 0) return events;

//     // Student can only see public/approved events
//     if (user.role === 'student') {
//       return events.filter((e) => e.status === 'approved' || e.status === 'upcoming');
//     }

//     // GroupAdmin can see their own events and approved events
//     if (user.role === 'groupAdmin') {
//       return events.filter(
//         (e) => e.organizerId === user.id || e.status === 'approved'
//       );
//     }

//     // DeptAdmin can see events in their department
//     if (user.role === 'deptAdmin') {
//       return events.filter((e) => e.department === user.department);
//     }

//     // Admin can see all events
//     return events;
//   }, [user, events]);
// }

// /**
//  * Get accessible departments based on user role
//  */
// export function useAccessibleDepartments(user: User | null): string[] {
//   return useMemo(() => {
//     if (!user) return [];

//     if (user.role === 'admin') {
//       return ['btech', 'bca', 'mca', 'bsc'];
//     }

//     if (user.role === 'deptAdmin' && user.department) {
//       return [user.department];
//     }

//     if (user.role === 'groupAdmin' && user.department) {
//       return [user.department];
//     }

//     return [];
//   }, [user]);
// }
