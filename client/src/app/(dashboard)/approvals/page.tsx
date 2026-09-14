// app/dashboard/approvals/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ApprovalEventCard from '@/components/events/ApprovalEventCard';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchDepartmentEvents, handleEventApproval, publishEvent } from '@/store/slices/eventsSlice';
import { Event } from '@/lib/schema/event.schema';
import { toast } from 'sonner';

export default function ApprovalDashboardPage() {
  const dispatch = useAppDispatch();
  const { departmentEvents, isLoading, error } = useAppSelector((state) => state.events);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [feedback, setFeedback] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartmentEvents('PENDING_APPROVAL'));
  }, [dispatch]);

  const pendingEvents = useMemo(
    () => departmentEvents.filter((e) => e.status === 'PENDING_APPROVAL'),
    [departmentEvents]
  );

  const categories = useMemo(
    () => Array.from(new Set(pendingEvents.map((e) => e.category))),
    [pendingEvents]
  );

  const filteredEvents = useMemo(
    () =>
      pendingEvents.filter(
        (event) => categoryFilter === 'All' || event.category === categoryFilter
      ),
    [pendingEvents, categoryFilter]
  );

  // Keep the selected event in sync with the store (e.g. after approve/reject it disappears)
  useEffect(() => {
    if (selectedEvent && !pendingEvents.some((e) => e.id === selectedEvent.id)) {
      setSelectedEvent(null);
      setFeedback('');
    }
  }, [pendingEvents, selectedEvent]);

  const handleApprove = async (eventId: string) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        handleEventApproval({ eventId, data: { action: 'approve', feedback: feedback || undefined } })
      ).unwrap();
      // Auto-publish so the event becomes visible right after approval
      await dispatch(publishEvent(eventId)).unwrap();
      toast.success('Event approved and published successfully');
      setSelectedEvent(null);
      setFeedback('');
    } catch (err: any) {
      toast.error(err || 'Failed to approve event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (eventId: string) => {
    if (!feedback.trim()) {
      toast.error('Please provide feedback for rejection');
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(
        handleEventApproval({ eventId, data: { action: 'reject', feedback } })
      ).unwrap();
      toast.success('Event rejected with feedback sent to organizer');
      setSelectedEvent(null);
      setFeedback('');
    } catch (err: any) {
      toast.error(err || 'Failed to reject event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Event Approvals</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Review and approve pending event submissions
          </p>
        </div>

        {/* Summary Card */}
        <Card className="border-orange-500/20 max-w-xs">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold mt-1">{pendingEvents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        {categories.length > 0 && (
          <Card className="border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-64 border-orange-500/30">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="py-6 text-center">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Event List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">
              Pending Events ({filteredEvents.length})
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <span className="ml-3 text-muted-foreground">Loading pending events...</span>
              </div>
            ) : filteredEvents.length === 0 ? (
              <Card className="border-orange-500/20">
                <CardContent className="py-16 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    No pending events to review at the moment
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event, index) => (
                  <ApprovalEventCard
                    key={event.id}
                    event={event}
                    isSelected={selectedEvent?.id === event.id}
                    onClick={() => setSelectedEvent(event)}
                    animationDelay={index * 50}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Review Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {selectedEvent ? (
                <>
                  <Card className="border-orange-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Title</p>
                        <p className="font-semibold">{selectedEvent.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-sm">{selectedEvent.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="text-sm font-medium">
                            {new Date(selectedEvent.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="text-sm font-medium">{selectedEvent.time}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Created By</p>
                        <p className="text-sm font-medium">{selectedEvent.creatorName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted On</p>
                        <p className="text-sm font-medium">
                          {new Date(selectedEvent.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Review & Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Comments / Feedback
                        </label>
                        <Textarea
                          placeholder="Add comments or feedback for the organizer..."
                          rows={4}
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          className="border-orange-500/20 focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={() => handleApprove(selectedEvent.id)}
                          disabled={isSubmitting}
                          className="w-full bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Approve Event
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(selectedEvent.id)}
                          disabled={isSubmitting}
                          className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          Reject Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-orange-500/20">
                  <CardContent className="py-16 text-center">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select an event to review details and take action
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
