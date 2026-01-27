// hooks/useEventFilters.ts
'use client';

import { Department } from '@/lib/types/department.types';
import { useState } from 'react';

export interface EventFilters {
  departments: Department[];
  categories: string[];
  dateRange: string;
  mode: string;
}

export function useEventFilters() {
  const [filters, setFilters] = useState<EventFilters>({
    departments: [],
    categories: [],
    dateRange: 'all',
    mode: 'All'
  });

  const setDepartments = (departments: Department[]) => {
    setFilters(prev => ({ ...prev, departments }));
  };

  const setCategories = (categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }));
  };

  const setDateRange = (dateRange: string) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const setMode = (mode: string) => {
    setFilters(prev => ({ ...prev, mode }));
  };

  const resetFilters = () => {
    setFilters({
      departments: [],
      categories: [],
      dateRange: 'all',
      mode: 'All'
    });
  };

  return {
    filters,
    setDepartments,
    setCategories,
    setDateRange,
    setMode,
    resetFilters
  };
}