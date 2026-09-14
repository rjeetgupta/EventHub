'use client';

import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/api/axios';

interface User {
  id: string;
  fullName: string;
  email: string;
  studentID?: string;
  roleId: string;
  departmentId?: string;
}

export function useAvailableUsers(departmentId: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!departmentId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch users from the same department who are not already group admins
      const response = await axiosInstance.get(`/users`, {
        params: {
          departmentId,
          role: 'STUDENT', // Only students can be assigned as group admins
          excludeGroupAdmins: true,
          limit: 100,
        },
      });

      setUsers(response.data?.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Exposed so callers can refresh the list right after a group admin is
  // assigned/removed, instead of waiting for a full page reload — otherwise
  // a just-assigned user would still show up as "available" in this session.
  return { users, isLoading, error, refetch: fetchUsers };
}
