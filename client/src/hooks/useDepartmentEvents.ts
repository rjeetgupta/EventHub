// hooks/useDepartmentEvents.ts
'use client';

import { useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchDepartmentEvents } from '@/store/slices/eventsSlice';
import { EventStatus } from '@/lib/types/common.types';

export function useDepartmentEvents(departmentId?: string) {
  const dispatch = useAppDispatch();
  const { departmentEvents, isLoading } = useAppSelector((state) => state.events);

  // Fetch this department's events once we know who we are
  useEffect(() => {
    if (departmentId) {
      dispatch(fetchDepartmentEvents());
    }
  }, [departmentId, dispatch]);

  // 📊 Stats
  const eventStats = useMemo(() => {
    const now = new Date();

    const totalEvents = departmentEvents.length;

    const upcomingEvents = departmentEvents.filter(
      (e) => e.status === EventStatus.PUBLISHED && new Date(e.date) >= now
    ).length;

    const completedEvents = departmentEvents.filter(
      (e) => e.status === EventStatus.COMPLETED
    ).length;

    const pendingEvents = departmentEvents.filter(
      (e) => e.status === EventStatus.PENDING_APPROVAL
    ).length;

    return {
      totalEvents,
      upcomingEvents,
      completedEvents,
      pendingEvents,
    };
  }, [departmentEvents]);

  return {
    departmentEvents,
    eventStats,
    isLoading,
  };
}
