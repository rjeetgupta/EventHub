// hooks/useDepartmentEvents.ts
'use client';

import { useMemo, useEffect } from 'react';
import { useAppSelector } from '@/store/hook';
import { useEventFilters } from '@/hooks/useEventFilters';
import { EventStatus } from '@/lib/types/common.types';

export function useDepartmentEvents(departmentId: string) {
  const { events } = useAppSelector((state) => state.events);

  const {
    filters,
    setDepartments,
  } = useEventFilters();

  // 🔒 Lock department
  useEffect(() => {
    if (departmentId) {
      setDepartments([departmentId]);
    }
  }, [departmentId, setDepartments]);

  const departmentEvents = useMemo(() => {
    let filtered = events;

    // department scope
    if (filters.departments.length > 0) {
      filtered = filtered.filter(
        (e) => filters.departments.includes(e.departmentId)
      );
    }

    // category
    if (filters.categories.length > 0) {
      filtered = filtered.filter(
        (e) => filters.categories.includes(e.category)
      );
    }

    // mode
    if (filters.mode !== 'All') {
      filtered = filtered.filter(
        (e) => e.mode === filters.mode
      );
    }

    return filtered;
  }, [events, filters]);

  // 📊 Stats
  const eventStats = useMemo(() => {
    const now = new Date();

    const totalEvents = departmentEvents.length;

    const upcomingEvents = departmentEvents.filter(
      (e) =>
        e.status === EventStatus.PUBLISHED &&
        new Date(e.date) >= now
    ).length;

    const completedEvents = departmentEvents.filter(
      (e) =>
        e.status === EventStatus.PUBLISHED &&
        new Date(e.date) < now
    ).length;

    const pendingEvents = departmentEvents.filter(
      (e) => e.status === EventStatus.DRAFT
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
    filters,
  };
}
