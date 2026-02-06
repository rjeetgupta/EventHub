// components/events/EventFeed.tsx
'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchEvents } from '@/store/slices/eventsSlice';
import Spinner from '@/components/common/Spinner';
import { EventFilters } from '@/hooks/useEventFilters';
import { EventStatus } from '@/lib/types/common.types';

interface EventFeedProps {
  status: 'upcoming' | 'finished';
  filters: EventFilters & { search?: string };
  isLoggedIn: boolean;
  userId?: string;
}

export function EventFeed({ status, filters, isLoggedIn, userId }: EventFeedProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { events, isLoading, error } = useAppSelector((state) => state.events);

  // Fetch events on mount and when filters change
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Filter events based on status and filters
  const filteredEvents = useMemo(() => {
    if (!events) return [];

    let filtered = events;

    // Filter by status (upcoming/finished)
    const now = new Date();
    filtered = filtered.filter((event) => {
      const eventDate = new Date(event.date);
      if (event.status === "DRAFT") return true;
      return status === 'upcoming'
        ? eventDate >= now && event.status === EventStatus.PUBLISHED
        : eventDate < now;
    });

    // Filter by departments
    if (filters.departments.length > 0) {
      filtered = filtered.filter((event) =>
        filters.departments.includes(event.departmentId)
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((event) =>
        filters.categories.includes(event.category)
      );
    }

    // Filter by mode
    if (filters.mode !== 'All') {
      filtered = filtered.filter((event) => event.mode === filters.mode);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        switch (filters.dateRange) {
          case 'today':
            return eventDate.getTime() === today.getTime();
          case 'week': {
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            return eventDate >= today && eventDate <= weekFromNow;
          }
          case 'month': {
            const monthFromNow = new Date(today);
            monthFromNow.setMonth(today.getMonth() + 1);
            return eventDate >= today && eventDate <= monthFromNow;
          }
          default:
            return true;
        }
      });
    }

    // Filter by search query
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.departmentName?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [events, status, filters]);

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Empty state
  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
        <p className="text-muted-foreground mb-6">
          {status === 'upcoming'
            ? 'No upcoming events match your filters'
            : 'No finished events match your filters'}
        </p>
        {isLoggedIn && (
          <Button
            onClick={() => router.push('/events/create')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            Create Event
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map((event) => {
        const isRegistered = event.registeredUsers?.includes(userId || '');
        const isFull = event.currentRegistrations >= event.maxCapacity;

        return (
          <Card
            key={event.id}
            className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 cursor-pointer group"
            onClick={() => handleEventClick(event.id)}
          >
            <CardContent className="p-6 space-y-4">
              {/* Header with badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                  {event.category}
                </Badge>
                <Badge variant="outline" className="border-blue-500/30 text-blue-500">
                  {event.mode}
                </Badge>
                {isRegistered && (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    Registered
                  </Badge>
                )}
                {isFull && status === 'upcoming' && (
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                    Full
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-orange-500 transition-colors">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="line-clamp-1">{event.venue || 'Online'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span>
                    {event.currentRegistrations}/{event.maxCapacity} registered
                  </span>
                </div>
              </div>

              {/* Department */}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Organized by <span className="font-medium">{event.departmentName}</span>
                </p>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Button
                variant="ghost"
                className="w-full group-hover:bg-orange-500/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event.id);
                }}
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}