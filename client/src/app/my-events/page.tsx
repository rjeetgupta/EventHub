'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Award, Eye, Download, CalendarX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MyEventCard } from '@/components/events/MyEventCard';
import { EmptyState } from '@/components/events/EmptyState';
import { StatusToggle } from '@/components/events/StatusToggle';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchMyEvents } from '@/store/slices/eventsSlice';

interface MyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  department: string;
  category: string;
  mode: string;
  status: 'upcoming' | 'finished';
  registrationStatus: 'registered' | 'attended' | 'missed';
  certificateAvailable: boolean;
  hasResults: boolean;
}

export default function MyEventsPage() {
  const dispatch = useAppDispatch();
  const [activeStatus, setActiveStatus] = useState<'upcoming' | 'finished'>('upcoming');

  const { myEvents, myRegistrations, isLoading, error } = useAppSelector(
    (state) => state.events
  );

  // Fetch events when status changes
  useEffect(() => {
    dispatch(fetchMyEvents(activeStatus));
  }, [dispatch, activeStatus]);

  // Transform events to match MyEventCard props
  const transformedEvents = myEvents?.map((event) => {
    const registration = myRegistrations.find(reg => reg.eventId === event.id);
    
    return {
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      department: event.departmentName,
      category: event.category,
      mode: event.mode,
      status: activeStatus,
      registrationStatus: registration?.status === 'ATTENDED' 
        ? 'attended' as const
        : registration?.status === 'ABSENT'
        ? 'missed' as const
        : 'registered' as const,
      certificateAvailable: registration?.status === 'ATTENDED',
      hasResults: event.status === 'COMPLETED',
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">My Events</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your registered events and participation
          </p>
        </div>

        {/* Summary Stats */}
        {!isLoading && !error && transformedEvents.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-orange-500/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{transformedEvents.length}</div>
                <div className="text-sm text-muted-foreground">
                  {activeStatus === 'upcoming' ? 'Upcoming' : 'Finished'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-500/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">
                  {transformedEvents.filter(e => e.registrationStatus === 'attended').length}
                </div>
                <div className="text-sm text-muted-foreground">Attended</div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-500/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">
                  {transformedEvents.filter(e => e.certificateAvailable).length}
                </div>
                <div className="text-sm text-muted-foreground">Certificates</div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-500/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">
                  {new Set(transformedEvents.map(e => e.category)).size}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Status Toggle */}
        <StatusToggle
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-3 text-muted-foreground">Loading your events...</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="py-8 text-center">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Event List or Empty State */}
        {!isLoading && !error && transformedEvents.length === 0 ? (
          <EmptyState 
            status={activeStatus}
            hasAnyEvents={myEvents?.length > 0}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedEvents?.map((event, index) => (
              <MyEventCard 
                key={event.id} 
                event={event} 
                animationDelay={index * 50}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}