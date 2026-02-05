'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  fetchDepartmentById,
  fetchGroupAdmins,
  assignGroupAdmin,
  updateGroupAdminPermissions,
  removeGroupAdmin,
  toggleGroupAdminStatus,
  fetchAvailablePermissions,
  fetchDepartmentAnalytics,
} from "@/store/slices/departmentSlice";
import { Permission } from '@/lib/schema/department.schema';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hook';

export function useDepartmentAdmin(departmentId: string) {
  const dispatch = useAppDispatch();
  const {
    currentDepartment,
    groupAdmins,
    availablePermissions,
    analytics,
    isLoading,
    isLoadingGroupAdmins,
    isAssigningAdmin,
    isUpdatingPermissions,
    isRemovingAdmin,
    isLoadingAnalytics,
    error,
  } = useAppSelector((state) => state.departments);

  // Fetch department data on mount
  useEffect(() => {
    if (departmentId) {
      dispatch(fetchDepartmentById(departmentId));
      dispatch(fetchGroupAdmins({ departmentId }));
      dispatch(fetchAvailablePermissions());
      dispatch(fetchDepartmentAnalytics({ id: departmentId }));
    }
  }, [departmentId, dispatch]);

  // Handle assign group admin
  const handleAssignGroupAdmin = useCallback(
    async (userId: string, permissions: Permission[]) => {
      try {
        const result = await dispatch(
          assignGroupAdmin({
            departmentId,
            data: { userId, permissions },
          })
        ).unwrap();

        toast.success('Group admin assigned successfully');
        return { success: true, data: result };
      } catch (error: any) {
        toast.error(error || 'Failed to assign group admin');
        return { success: false, error };
      }
    },
    [departmentId, dispatch]
  );

  // Handle update permissions
  const handleUpdatePermissions = useCallback(
    async (groupAdminId: string, permissions: Permission[]) => {
      try {
        const result = await dispatch(
          updateGroupAdminPermissions({
            departmentId,
            groupAdminId,
            data: { permissions },
          })
        ).unwrap();

        toast.success('Permissions updated successfully');
        return { success: true, data: result };
      } catch (error: any) {
        toast.error(error || 'Failed to update permissions');
        return { success: false, error };
      }
    },
    [departmentId, dispatch]
  );

  // Handle remove group admin
  const handleRemoveGroupAdmin = useCallback(
    async (groupAdminId: string) => {
      try {
        await dispatch(
          removeGroupAdmin({
            departmentId,
            groupAdminId,
          })
        ).unwrap();

        toast.success('Group admin removed successfully');
        return { success: true };
      } catch (error: any) {
        toast.error(error || 'Failed to remove group admin');
        return { success: false, error };
      }
    },
    [departmentId, dispatch]
  );

  // Handle toggle status
  const handleToggleStatus = useCallback(
    async (groupAdminId: string, currentStatus: boolean) => {
      try {
        const result = await dispatch(
          toggleGroupAdminStatus({
            departmentId,
            groupAdminId,
            isActive: !currentStatus,
          })
        ).unwrap();

        toast.success(
          `Group admin ${!currentStatus ? 'activated' : 'deactivated'} successfully`
        );
        return { success: true, data: result };
      } catch (error: any) {
        toast.error(error || 'Failed to toggle status');
        return { success: false, error };
      }
    },
    [departmentId, dispatch]
  );

  // Refresh data
  const refreshData = useCallback(() => {
    if (departmentId) {
      dispatch(fetchDepartmentById(departmentId));
      dispatch(fetchGroupAdmins({ departmentId }));
      dispatch(fetchDepartmentAnalytics({ id: departmentId }));
    }
  }, [departmentId, dispatch]);

  return {
    // Data
    department: currentDepartment,
    groupAdmins,
    availablePermissions,
    analytics,

    // Loading states
    isLoading,
    isLoadingGroupAdmins,
    isAssigningAdmin,
    isUpdatingPermissions,
    isRemovingAdmin,
    isLoadingAnalytics,

    // Error
    error,

    // Actions
    handleAssignGroupAdmin,
    handleUpdatePermissions,
    handleRemoveGroupAdmin,
    handleToggleStatus,
    refreshData,
  };
}