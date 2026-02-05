'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchUsers = async () => {
      if (!departmentId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch users from the same department who are not already group admins
        const response = await axiosInstance.get(`/users`, {
          params: {
            departmentId,
            role: 'STUDENT', // Only students can be assigned as group admins
            limit: 100,
          },
        });

        setUsers(response.data.data || response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [departmentId]);

  return { users, isLoading, error };
}