// app/department/events/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Plus, FileText, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DepartmentEventCard } from '@/components/events/DepartmentEventCard';
import { EventFormDialog } from '@/components/forms/EventFormDialog';
import { DeleteConfirmationModal } from '@/components/modals/ConfirmModal';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { deleteEvent, fetchDepartmentEvents, submitEventForApproval } from '@/store/slices/eventsSlice';
import { Event } from '@/lib/schema/event.schema';
import { toast } from 'sonner';

export default function DepartmentEventsPage() {
  const dispatch = useAppDispatch();
  const { departmentEvents, isLoading, isDeleting, error } = useAppSelector((state) => state.events);

  const [activeTab, setActiveTab] = useState('pending');
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDepartmentEvents());
  }, [dispatch]);

  const draftEvents = useMemo(
    () => departmentEvents.filter((e) => e.status === 'DRAFT' || e.status === 'REJECTED'),
    [departmentEvents]
  );
  const pendingEvents = useMemo(
    () => departmentEvents.filter((e) => e.status === 'PENDING_APPROVAL'),
    [departmentEvents]
  );
  const upcomingEvents = useMemo(
    () =>
      departmentEvents.filter((e) =>
        ['APPROVED', 'PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING'].includes(e.status)
      ),
    [departmentEvents]
  );
  const finishedEvents = useMemo(
    () => departmentEvents.filter((e) => e.status === 'COMPLETED'),
    [departmentEvents]
  );

  const openCreateDialog = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleSubmitForApproval = async (event: Event) => {
    setSubmittingId(event.id);
    try {
      await dispatch(submitEventForApproval(event.id)).unwrap();
      toast.success('Event submitted for approval');
    } catch (err: any) {
      toast.error(err || 'Failed to submit event');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;
    try {
      await dispatch(deleteEvent(deletingEvent.id)).unwrap();
      toast.success('Event deleted successfully');
      setDeletingEvent(null);
    } catch (err: any) {
      toast.error(err || 'Failed to delete event');
    }
  };

  const renderGrid = (events: Event[], emptyIcon: React.ReactNode, emptyTitle: string, emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <span className="ml-3 text-muted-foreground">Loading events...</span>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <Card className="border-orange-500/20">
          <CardContent className="py-16 text-center">
            {emptyIcon}
            <h3 className="text-xl font-semibold mb-2">{emptyTitle}</h3>
            <p className="text-muted-foreground mb-6">{emptyMessage}</p>
            {emptyTitle === 'No Draft Events' && (
              <Button
                onClick={openCreateDialog}
                className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Event
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <DepartmentEventCard
            key={event.id}
            event={event}
            animationDelay={index * 50}
            onEdit={openEditDialog}
            onDelete={setDeletingEvent}
            onSubmit={handleSubmitForApproval}
            isProcessing={isDeleting || submittingId === event.id}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
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
          <Button
            onClick={openCreateDialog}
            className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="py-6 text-center">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

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
            {renderGrid(
              draftEvents,
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />,
              'No Draft Events',
              "You don't have any draft events. Start creating one!"
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {renderGrid(
              pendingEvents,
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />,
              'No Pending Events',
              'Events submitted for approval will appear here'
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {renderGrid(
              upcomingEvents,
              <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />,
              'No Approved Events',
              'Approved upcoming events will appear here'
            )}
          </TabsContent>

          <TabsContent value="finished" className="mt-6">
            {renderGrid(
              finishedEvents,
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />,
              'No Finished Events',
              'Completed events will appear here'
            )}
          </TabsContent>
        </Tabs>
      </div>

      <EventFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        event={editingEvent}
        onSuccess={() => dispatch(fetchDepartmentEvents())}
      />

      <DeleteConfirmationModal
        open={Boolean(deletingEvent)}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        description={`This will permanently delete "${deletingEvent?.title}". This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
