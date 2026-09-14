'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Calendar,
  Users,
  TrendingUp,
  Plus,
  Edit2,
  Eye,
  CheckCircle,
  Clock,
  Award,
  Send,
  FileText,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchDepartmentEvents, submitEventForApproval } from '@/store/slices/eventsSlice';
import { Event } from '@/lib/schema/event.schema';
import { EventFormDialog } from '@/components/forms/EventFormDialog';
import { toast } from 'sonner';

export default function GroupAdminDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { departmentEvents, isLoading } = useAppSelector((state) => state.events);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDepartmentEvents());
  }, [dispatch]);

  // Only the events this group admin created
  const myEvents = useMemo(
    () => departmentEvents.filter((e) => e.creatorId === user?.id),
    [departmentEvents, user?.id]
  );

  const stats = useMemo(() => {
    const now = new Date();
    const draftEvents = myEvents.filter((e) => e.status === 'DRAFT' || e.status === 'REJECTED').length;
    const approvedEvents = myEvents.filter((e) =>
      ['APPROVED', 'PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING'].includes(e.status)
    ).length;
    const upcomingEvents = myEvents.filter(
      (e) => e.status === 'PUBLISHED' && new Date(e.date) >= now
    ).length;
    const totalRegistrations = myEvents.reduce((sum, e) => sum + e.currentRegistrations, 0);
    const completedWithCapacity = myEvents.filter((e) => e.status === 'COMPLETED' && e.maxCapacity > 0);
    const averageAttendance = completedWithCapacity.length
      ? Math.round(
          completedWithCapacity.reduce((sum, e) => sum + (e.currentRegistrations / e.maxCapacity) * 100, 0) /
            completedWithCapacity.length
        )
      : 0;

    return {
      myEvents: myEvents.length,
      draftEvents,
      approvedEvents,
      totalRegistrations,
      averageAttendance,
      upcomingEvents,
    };
  }, [myEvents]);

  const eventPerformanceData = useMemo(
    () =>
      myEvents
        .filter((e) => e.currentRegistrations > 0 || e.maxCapacity > 0)
        .slice(0, 6)
        .map((e) => ({
          event: e.title.length > 16 ? `${e.title.slice(0, 16)}…` : e.title,
          registrations: e.currentRegistrations,
          capacity: e.maxCapacity,
        })),
    [myEvents]
  );

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const handleSubmitDraft = async (event: Event) => {
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-500',
      PENDING_APPROVAL: 'bg-yellow-500',
      APPROVED: 'bg-green-500',
      REJECTED: 'bg-red-500',
      PUBLISHED: 'bg-blue-500',
      REGISTRATION_CLOSED: 'bg-purple-500',
      ONGOING: 'bg-indigo-500',
      COMPLETED: 'bg-gray-400',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getCapacityPercentage = (registrations: number, capacity: number) => {
    return capacity > 0 ? (registrations / capacity) * 100 : 0;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Group Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage events for your department
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Events</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Total created</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Not submitted</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to go</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Published & upcoming</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Registrations</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
            <p className="text-xs text-muted-foreground mt-1">Total participants</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAttendance}%</div>
            <p className="text-xs text-muted-foreground mt-1">Completed events</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {eventPerformanceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Event Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="registrations" fill="#fb923c" name="Registrations" />
                <Bar dataKey="capacity" fill="#fed7aa" name="Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          onClick={openCreateDialog}
          className="border-orange-500/20 hover:border-orange-500/40 cursor-pointer transition-all"
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Plus className="w-6 h-6 text-orange-500" />
              </div>
              <p className="font-semibold">Create Event</p>
              <p className="text-xs text-muted-foreground">Start new event</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 hover:border-amber-500/40 transition-all">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <Send className="w-6 h-6 text-amber-500" />
              </div>
              <p className="font-semibold">Submit Drafts</p>
              <p className="text-xs text-muted-foreground">{stats.draftEvents} pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 hover:border-green-500/40 transition-all">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Award className="w-6 h-6 text-green-500" />
              </div>
              <p className="font-semibold">Avg. Attendance</p>
              <p className="text-xs text-muted-foreground">{stats.averageAttendance}% across completed events</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : myEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No events yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first event to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.mode}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {event.currentRegistrations}/{event.maxCapacity}
                          </span>
                        </div>
                        <Progress
                          value={getCapacityPercentage(event.currentRegistrations, event.maxCapacity)}
                          className="h-1.5"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {event.status === 'DRAFT' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSubmitDraft(event)}
                            disabled={submittingId === event.id}
                            className="h-8 w-8 p-0"
                            title="Submit for approval"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewEvent(event)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(event.status === 'DRAFT' || event.status === 'REJECTED') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(event)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Event Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedEvent.status)}>
                    {selectedEvent.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mode</p>
                  <Badge variant="outline">{selectedEvent.mode}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium">{selectedEvent.venue || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">
                    {selectedEvent.currentRegistrations}/{selectedEvent.maxCapacity}
                  </p>
                </div>
              </div>
              {selectedEvent.status === 'REJECTED' && selectedEvent.rejectionReason && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-500">{selectedEvent.rejectionReason}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedEvent.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Registration Progress</p>
                <Progress
                  value={getCapacityPercentage(
                    selectedEvent.currentRegistrations,
                    selectedEvent.maxCapacity
                  )}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedEvent.currentRegistrations} of {selectedEvent.maxCapacity} spots filled
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedEvent && (selectedEvent.status === 'DRAFT' || selectedEvent.status === 'REJECTED') && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  openEditDialog(selectedEvent);
                }}
                className="bg-linear-to-r from-orange-500 to-amber-500"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Event
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EventFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        event={editingEvent}
        onSuccess={() => dispatch(fetchDepartmentEvents())}
      />
    </div>
  );
}
