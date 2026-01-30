/**
 * ============================================================================
 * EVENT FEED - IMPROVED VERSION
 * ============================================================================
 * Production-ready event feed with real API integration
 */

'use client';

import React, { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchEvents, clearError } from '@/store/slices/eventsSlice';
import { EventCard } from '@/components/events/EventCard';
import { EmptyState } from '@/components/common/CardComponents';
import Spinner from '@/components/common/Spinner';
import ErrorComponents from '@/components/common/ErrorComponents';
import { EventFilters } from '@/lib/schema/event.schema';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface EventFeedProps {
  status: 'upcoming' | 'finished';
  filters: {
    departments: string[];
    categories: string[];
    dateRange: string;
    mode: string;
    search?: string;
  };
  isLoggedIn: boolean;
  userId?: string | null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert UI filters to API filters
 */
const convertFiltersToApiFormat = (
  filters: EventFeedProps['filters'],
  status: 'upcoming' | 'finished'
): Partial<EventFilters> => {
  const now = new Date().toISOString();
  const apiFilters: Partial<EventFilters> = {};

  // Department filter
  if (filters.departments.length > 0) {
    apiFilters.departments = filters.departments;
  }

  // Category filter
  if (filters.categories.length > 0) {
    apiFilters.categories = filters.categories;
  }

  // Mode filter
  if (filters.mode && filters.mode !== 'All') {
    apiFilters.mode = filters.mode as any;
  }

  // Search filter
  if (filters.search) {
    apiFilters.search = filters.search;
  }

  // Date range filter
  switch (filters.dateRange) {
    case 'today':
      apiFilters.dateFrom = now;
      apiFilters.dateTo = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'week':
      apiFilters.dateFrom = now;
      apiFilters.dateTo = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'month':
      apiFilters.dateFrom = now;
      apiFilters.dateTo = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      break;
  }

  // Status-based date filtering
  if (status === 'upcoming') {
    apiFilters.dateFrom = now;
    apiFilters.status = 'PUBLISHED' as any;
  } else {
    apiFilters.dateTo = now;
    apiFilters.status = 'COMPLETED' as any;
  }

  return apiFilters;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function EventFeed({ status, filters, isLoggedIn, userId }: EventFeedProps) {
  const dispatch = useAppDispatch();
  
  const { events, isLoading, error } = useAppSelector((state) => state.events);
  const currentUser = useAppSelector((state) => state.auth.user);

  /**
   * Fetch events when filters change
   */
  useEffect(() => {
    const apiFilters = convertFiltersToApiFormat(filters, status);
    dispatch(fetchEvents(apiFilters));

    // Cleanup on unmount
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, filters, status]);

  /**
   * Filter events by status on client side as additional safety
   */
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    const now = new Date();
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      
      if (status === 'upcoming') {
        return eventDate >= now && event.status === 'PUBLISHED';
      } else {
        return eventDate < now || event.status === 'COMPLETED';
      }
    });
  }, [events, status]);

  /**
   * Check if user is registered for an event
   */
  const isUserRegistered = useCallback(
    (eventId: string): boolean => {
      if (!userId) return false;
      const event = events?.find((e) => e.id === eventId);
      return event?.registeredUsers?.includes(userId) || false;
    },
    [userId, events]
  );

  /**
   * Retry loading events
   */
  const handleRetry = useCallback(() => {
    const apiFilters = convertFiltersToApiFormat(filters, status);
    dispatch(fetchEvents(apiFilters));
  }, [dispatch, filters, status]);

  // ============================================================================
  // RENDER STATES
  // ============================================================================

  // Loading state
  if (isLoading && !events) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner />
      </div>
    );
  }

  // Error state
  if (error && !events) {
    return (
      <div className="space-y-4">
        <ErrorComponents 
          title="Error Loading Events" 
          error={error}
        />
        <div className="flex justify-center">
          <Button
            onClick={handleRetry}
            variant="outline"
            className="border-orange-500/30 hover:bg-orange-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty state - no events found
  if (filteredEvents.length === 0) {
    const hasActiveFilters =
      filters.search ||
      filters.departments.length > 0 ||
      filters.categories.length > 0 ||
      filters.mode !== 'All' ||
      filters.dateRange !== 'all';

    return (
      <EmptyState
        icon={hasActiveFilters ? '🔍' : status === 'upcoming' ? '📅' : '✅'}
        title={hasActiveFilters ? 'No events found' : `No ${status} events`}
        description={
          hasActiveFilters
            ? 'Try adjusting your filters or search query to see more events'
            : status === 'upcoming'
            ? 'No upcoming events available at the moment. Check back soon!'
            : 'No finished events to display.'
        }
      />
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEvents.length} {status} event
          {filteredEvents.length !== 1 ? 's' : ''}
        </p>

        {/* Refresh button */}
        {!isLoading && (
          <Button
            onClick={handleRetry}
            variant="ghost"
            size="sm"
            className="hover:bg-orange-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      {/* Loading overlay when refetching */}
      {isLoading && events && (
        <div className="flex justify-center py-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Spinner />
            <span>Updating events...</span>
          </div>
        </div>
      )}

      {/* Events grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {filteredEvents.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            isLoggedIn={isLoggedIn}
            isRegistered={isUserRegistered(event.id)}
            animationDelay={index * 50}
          />
        ))} */}
      </div>

      {/* Error banner if there's an error but we have cached events */}
      {error && events && (
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            ⚠️ {error}. Showing cached events.
          </p>
        </div>
      )}
    </div>
  );
}