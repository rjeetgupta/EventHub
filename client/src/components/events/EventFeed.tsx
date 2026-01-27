'use client';

import React, { useEffect, useMemo } from 'react';
import { EventCard } from './EventCard';
import { Event } from '@/lib/types/event.types';
import { filterAndSortEvents } from '@/lib/eventUtils';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchEvents } from '@/store/slices/eventsSlice';
import Spinner from '../common/Spinner';
import ErrorComponents from '../common/ErrorComponents';

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

export function EventFeed({ status, filters, isLoggedIn, userId }: EventFeedProps) {

  const dispatch = useAppDispatch();
  
  const { events, isLoading, error } = useAppSelector((state) => state.events);
  const currentUser = useAppSelector((state) => state.auth.user);

  // Fetch events on mount and when filters change
  useEffect(() => {
    const fetchParams = {
      departments: filters.departments.length > 0 ? filters.departments : undefined,
      categories: filters.categories.length > 0 ? filters.categories : undefined,
      mode: filters.mode !== 'All' ? filters.mode : undefined,
      // Convert dateRange to actual date filters
      ...(filters.dateRange === 'today' && {
        dateFrom: new Date().toISOString(),
        dateTo: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
      ...(filters.dateRange === 'week' && {
        dateFrom: new Date().toISOString(),
        dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }),
      ...(filters.dateRange === 'month' && {
        dateFrom: new Date().toISOString(),
        dateTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    };

    dispatch(fetchEvents(fetchParams));
  }, [dispatch, filters]);

  // Filter events based on status (upcoming/finished)
  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events?.filter(event => {
      const eventDate = new Date(event.date);
      if (status === 'upcoming') {
        return eventDate >= now;
      } else {
        return eventDate < now;
      }
    });
  }, [events, status]);

  const isUserRegistered = (event: any) => {
    if (!userId) return false;
    return event.registeredUsers?.includes(userId) || false;
  };

  // This would come from your API/database
  // const allEvents: Event[] = useMemo(() => [
  //   {
  //     id: '1',
  //     title: 'AI & Machine Learning Workshop',
  //     date: '2024-12-25',
  //     time: '10:00 AM',
  //     department: 'Computer Science',
  //     category: 'Workshop',
  //     mode: 'Hybrid',
  //     status: 'upcoming',
  //     registrations: 245,
  //     maxCapacity: 300,
  //     registeredUsers: [],
  //     description: 'Learn the fundamentals of AI and ML'
  //   },
  //   {
  //     id: '2',
  //     title: 'Annual Tech Fest 2024',
  //     date: '2024-12-28',
  //     time: '9:00 AM',
  //     department: 'All Departments',
  //     category: 'Technical',
  //     mode: 'Offline',
  //     status: 'upcoming',
  //     registrations: 890,
  //     maxCapacity: 1000,
  //     registeredUsers: [],
  //     description: 'Biggest tech festival of the year'
  //   },
  //   {
  //     id: '3',
  //     title: 'Cultural Night - Euphoria',
  //     date: '2024-12-30',
  //     time: '6:00 PM',
  //     department: 'Cultural Committee',
  //     category: 'Cultural',
  //     mode: 'Offline',
  //     status: 'upcoming',
  //     registrations: 567,
  //     maxCapacity: 800,
  //     registeredUsers: [],
  //     description: 'An evening of music, dance, and drama'
  //   },
  //   {
  //     id: '101',
  //     title: 'CodeFest 2024 - National Hackathon',
  //     date: '2024-12-15',
  //     time: '9:00 AM',
  //     department: 'Computer Science',
  //     category: 'Technical',
  //     mode: 'Offline',
  //     status: 'finished',
  //     registrations: 450,
  //     maxCapacity: 450,
  //     registeredUsers: [],
  //     winner: 'Team AlphaCoders',
  //     description: '48-hour coding competition'
  //   },
  //   {
  //     id: '102',
  //     title: 'Annual Sports Meet 2024',
  //     date: '2024-12-10',
  //     time: '7:00 AM',
  //     department: 'Sports Committee',
  //     category: 'Sports',
  //     mode: 'Offline',
  //     status: 'finished',
  //     registrations: 800,
  //     maxCapacity: 800,
  //     registeredUsers: [],
  //     winner: 'CS Department',
  //     description: 'Inter-department sports competition'
  //   },
  //   {
  //     id: '103',
  //     title: 'TEDx Campus Edition',
  //     date: '2024-12-05',
  //     time: '2:00 PM',
  //     department: 'All Departments',
  //     category: 'Seminar',
  //     mode: 'Offline',
  //     status: 'finished',
  //     registrations: 600,
  //     maxCapacity: 600,
  //     registeredUsers: [],
  //     description: 'Ideas worth spreading'
  //   }
  // ], []);

  // const filteredEvents = useMemo(() => {
  //   return filterAndSortEvents(allEvents, status, filters);
  // }, [allEvents, status, filters]);

  // const isUserRegistered = (event: Event) => {
  //   if (!userId) return false;
  //   return event.registeredUsers?.includes(userId) || false;
  // };

  // Empty state
  if (filteredEvents?.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No events found</h3>
        <p className="text-muted-foreground">
          {filters.search || filters.departments.length > 0 || filters.categories.length > 0
            ? 'Try adjusting your filters or search query to see more events'
            : `No ${status} events available at the moment`}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />
  }

  // Error state
  if (error) {
    return (
      <ErrorComponents title='Error Loading Events' error={error} />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEvents?.length} {status} event{filteredEvents?.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents?.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            isLoggedIn={isLoggedIn}
            isRegistered={isUserRegistered(event)}
            animationDelay={index * 50}
          />
        ))}
      </div>
    </div>
  );
}