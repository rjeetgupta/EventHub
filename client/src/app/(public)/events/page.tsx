'use client';

import React, { useState } from 'react';
import { PageHeading } from '@/components/events/PageHeading';
import { EventFilters } from '@/components/events/EventFilters';
import { StatusToggle } from '@/components/events/StatusToggle';
import { EventFeed } from '@/components/events/EventFeed';
import { useEventFilters } from '@/hooks/useEventFilters';
import { useAppSelector } from '@/store/hook';

export default function EventsPage() {
  const [statusTab, setStatusTab] = useState<'upcoming' | 'finished'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    filters,
    setDepartments,
    setCategories,
    setDateRange,
    setMode,
    resetFilters
  } = useEventFilters();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHeading />

        <EventFilters
          filters={filters}
          onDepartmentChange={setDepartments}
          onCategoryChange={setCategories}
          onDateRangeChange={setDateRange}
          onModeChange={setMode}
          onReset={resetFilters}
        />

        <StatusToggle
          activeStatus={statusTab}
          onStatusChange={setStatusTab}
        />

        <EventFeed
          status={statusTab}
          filters={{
            ...filters,
            search: searchQuery,
          }}
          isLoggedIn={isAuthenticated}
          userId={user?.id}
        />
      </div>
    </div>
  );
}