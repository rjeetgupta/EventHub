'use client';

import { useState, useCallback } from 'react';
import { User } from '@/lib/types/user.types';

interface GroupAdmin {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  createdAt: string;
}

interface PermissionManagementHookResult {
  groupAdmins: GroupAdmin[];
  isLoading: boolean;
  error: string | null;
  fetchGroupAdmins: () => Promise<void>;
  addPermission: (adminId: string, permissions: string[]) => Promise<void>;
  removePermission: (adminId: string, permissions: string[]) => Promise<void>;
  deleteAdmin: (adminId: string) => Promise<void>;
  canManagePermissions: boolean;
}

/**
 * Hook to manage group admin permissions
 * Only department admins can manage permissions for their department
 */
export function usePermissionManagement(currentUser: User | null): PermissionManagementHookResult {
  const [groupAdmins, setGroupAdmins] = useState<GroupAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only deptAdmin or admin can manage permissions
  const canManagePermissions = currentUser
    ? ['deptAdmin', 'admin'].includes(currentUser.role)
    : false;

  const fetchGroupAdmins = useCallback(async () => {
    if (!canManagePermissions) {
      setError('You do not have permission to manage group admins');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // For now, using mock data
      const response = await fetch('/api/department/group-admins', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch group admins');
      }

      const data = await response.json();
      setGroupAdmins(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [canManagePermissions]);

  const addPermission = useCallback(
    async (adminId: string, permissions: string[]) => {
      if (!canManagePermissions) {
        throw new Error('You do not have permission to manage permissions');
      }

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/department/group-admins/${adminId}/permissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permissions }),
        });

        if (!response.ok) {
          throw new Error('Failed to add permissions');
        }

        // Update local state
        setGroupAdmins((prev) =>
          prev.map((admin) =>
            admin.id === adminId
              ? {
                  ...admin,
                  permissions: Array.from(new Set([...admin.permissions, ...permissions])),
                }
              : admin
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add permissions';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [canManagePermissions]
  );

  const removePermission = useCallback(
    async (adminId: string, permissions: string[]) => {
      if (!canManagePermissions) {
        throw new Error('You do not have permission to manage permissions');
      }

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        const response = await fetch(
          `/api/department/group-admins/${adminId}/permissions`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ permissions }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to remove permissions');
        }

        // Update local state
        setGroupAdmins((prev) =>
          prev.map((admin) =>
            admin.id === adminId
              ? {
                  ...admin,
                  permissions: admin.permissions.filter(
                    (p) => !permissions.includes(p)
                  ),
                }
              : admin
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove permissions';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [canManagePermissions]
  );

  const deleteAdmin = useCallback(
    async (adminId: string) => {
      if (!canManagePermissions) {
        throw new Error('You do not have permission to delete admins');
      }

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/department/group-admins/${adminId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete admin');
        }

        // Update local state
        setGroupAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete admin';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [canManagePermissions]
  );

  return {
    groupAdmins,
    isLoading,
    error,
    fetchGroupAdmins,
    addPermission,
    removePermission,
    deleteAdmin,
    canManagePermissions,
  };
}
