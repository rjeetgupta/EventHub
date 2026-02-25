// app/department/events/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DepartmentEventCard } from '@/components/events/DepartmentEventCard';

interface DepartmentEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  mode: string;
  status: 'draft' | 'pending' | 'approved' | 'finished';
  registrations: number;
  maxCapacity: number;
}

export default function DepartmentEventsPage() {
  const [activeTab, setActiveTab] = useState('pending');

  // Mock data - replace with API call
  const events: DepartmentEvent[] = [
    {
      id: '1',
      title: 'AI Workshop Advanced',
      date: '2025-01-10',
      time: '10:00 AM',
      category: 'Workshop',
      mode: 'Hybrid',
      status: 'draft',
      registrations: 0,
      maxCapacity: 100
    },
    {
      id: '2',
      title: 'Web Development Bootcamp',
      date: '2025-01-15',
      time: '9:00 AM',
      category: 'Workshop',
      mode: 'Offline',
      status: 'pending',
      registrations: 45,
      maxCapacity: 80
    },
    {
      id: '3',
      title: 'Tech Symposium 2025',
      date: '2025-01-20',
      time: '2:00 PM',
      category: 'Seminar',
      mode: 'Offline',
      status: 'approved',
      registrations: 156,
      maxCapacity: 200
    },
    {
      id: '4',
      title: 'Hackathon Fall 2024',
      date: '2024-12-01',
      time: '9:00 AM',
      category: 'Competition',
      mode: 'Offline',
      status: 'finished',
      registrations: 120,
      maxCapacity: 120
    }
  ];

  const filterByStatus = (status: string) => {
    if (status === 'upcoming') {
      return events.filter(e => e.status === 'approved');
    }
    return events.filter(e => e.status === status);
  };

  const draftEvents = filterByStatus('draft');
  const pendingEvents = filterByStatus('pending');
  const upcomingEvents = filterByStatus('upcoming');
  const finishedEvents = filterByStatus('finished');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">My Department Events</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Manage events created by your department
            </p>
          </div>
          <Link href="/events/create">
            <Button className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-orange-500/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <FileText className="w-8 h-8 text-gray-500 mx-auto" />
                <div className="text-2xl font-bold">{draftEvents.length}</div>
                <div className="text-sm text-muted-foreground">Drafts</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-500/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto" />
                <div className="text-2xl font-bold">{pendingEvents.length}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-500/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                <div className="text-2xl font-bold">{upcomingEvents.length}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-500/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <XCircle className="w-8 h-8 text-blue-500 mx-auto" />
                <div className="text-2xl font-bold">{finishedEvents.length}</div>
                <div className="text-sm text-muted-foreground">Finished</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="draft" className="data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Draft ({draftEvents.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Pending ({pendingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Approved ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="finished" className="data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Finished ({finishedEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draft" className="mt-6">
            {draftEvents.length === 0 ? (
              <Card className="border-orange-500/20">
                <CardContent className="py-16 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Draft Events</h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any draft events. Start creating one!
                  </p>
                  <Link href="/events/create">
                    <Button className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Event
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {draftEvents.map((event, index) => (
                  <DepartmentEventCard key={event.id} event={event} animationDelay={index * 50} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {pendingEvents.length === 0 ? (
              <Card className="border-orange-500/20">
                <CardContent className="py-16 text-center">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Pending Events</h3>
                  <p className="text-muted-foreground">
                    Events submitted for approval will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingEvents.map((event, index) => (
                  <DepartmentEventCard key={event.id} event={event} animationDelay={index * 50} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingEvents.length === 0 ? (
              <Card className="border-orange-500/20">
                <CardContent className="py-16 text-center">
                  <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Approved Events</h3>
                  <p className="text-muted-foreground">
                    Approved upcoming events will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event, index) => (
                  <DepartmentEventCard key={event.id} event={event} animationDelay={index * 50} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="finished" className="mt-6">
            {finishedEvents.length === 0 ? (
              <Card className="border-orange-500/20">
                <CardContent className="py-16 text-center">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Finished Events</h3>
                  <p className="text-muted-foreground">
                    Completed events will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {finishedEvents.map((event, index) => (
                  <DepartmentEventCard key={event.id} event={event} animationDelay={index * 50} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}