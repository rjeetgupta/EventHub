'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Calendar,
  Users,
  Award,
  AlertCircle,
  Eye,
  Download,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { format } from 'date-fns';
import { RootState, AppDispatch } from '@/store';
import {
  fetchMyEvents,
  fetchEventById,
  registerForEvent,
  cancelEventRegistration,
  clearError,
} from '@/store/slices/eventsSlice';
import type { Event, Registration } from '@/lib/schema/event.schema';
import { useAppDispatch, useAppSelector } from '@/store/hook';

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

export default function UserDashboard() {
  const dispatch = useAppDispatch()
  const { user: currentUser } = useAppSelector((state) => state.auth);
  
  const {
    myEvents,
    myRegistrations,
    isLoading,
    error,
    isRegistering,
  } = useAppSelector((state) => state.events);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    certificatesEarned: 0,
    totalHours: 0,
    attendanceRate: 0,
  });

  // Fetch user's events on mount
  useEffect(() => {
    dispatch(fetchMyEvents(undefined));
  }, [dispatch]);

  // Calculate stats when events/registrations load
  useEffect(() => {
    const now = new Date();
    const upcoming = myEvents.filter(e => new Date(e.date) > now);
    const completed = myEvents.filter(e => new Date(e.date) < now);
    const attended = myRegistrations.filter(r => r.status === 'ATTENDED');
    const absent = myRegistrations.filter(r => r.status === 'ABSENT');
    const attendanceDenominator = attended.length + absent.length;

    setStats({
      totalEvents: myEvents.length,
      upcomingEvents: upcoming.length,
      completedEvents: completed.length,
      certificatesEarned: attended.length,
      totalHours: completed.length * 2, // Assuming 2 hours per event
      attendanceRate:
        attendanceDenominator > 0
          ? Math.round((attended.length / attendanceDenominator) * 100)
          : 0,
    });
  }, [myEvents, myRegistrations]);

  // Handle view event details
  const handleViewEvent = useCallback(async (eventId: string) => {
    try {
      const result = await dispatch(fetchEventById(eventId)).unwrap();
      // setSelectedEvent(result);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch event:', err);
    }
  }, [dispatch]);

  // Handle cancel registration
  const handleCancelRegistration = useCallback(async (eventId: string) => {
    try {
      await dispatch(cancelEventRegistration(eventId)).unwrap();
      dispatch(fetchMyEvents(undefined)); // Refresh events
    } catch (err) {
      console.error('Failed to cancel registration:', err);
    }
  }, [dispatch]);

  // Handle download certificate
  // const handleDownloadCertificate = useCallback(async (eventId: string) => {
  //   try {
  //     await dispatch(downloadEventCertificate(eventId)).unwrap();
  //   } catch (err) {
  //     console.error('Failed to download certificate:', err);
  //   }
  // }, [dispatch]);

  // Filter events by tab
  const getFilteredEvents = useCallback(() => {
    const now = new Date();
    switch (activeTab) {
      case 'upcoming':
        return myEvents.filter(e => new Date(e.date) > now);
      case 'completed':
        return myEvents.filter(e => new Date(e.date) < now);
      case 'all':
      default:
        return myEvents;
    }
  }, [activeTab, myEvents]);

  // Get event status badge
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: 'bg-blue-500',
      ongoing: 'bg-green-500',
      finished: 'bg-gray-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  // Get registration for event
  const getRegistration = useCallback((eventId: string) => {
    return myRegistrations.find(r => r.eventId === eventId);
  }, [myRegistrations]);

  // Chart data
  const eventsByDepartment = myEvents.reduce((acc, event) => {
    const dept = event.departmentName || 'Other';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.entries(eventsByDepartment).map(([name, value]) => ({
    name,
    value,
  }));

  const eventsByMode = myEvents.reduce((acc, event) => {
    acc[event.mode] = (acc[event.mode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const modeData = Object.entries(eventsByMode).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Monthly participation, derived from real registration dates
  const monthlyData = (() => {
    const counts = new Array(12).fill(0);
    myRegistrations.forEach((r) => {
      const month = new Date(r.registeredAt).getMonth();
      if (!Number.isNaN(month)) counts[month] += 1;
    });
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return labels.map((month, i) => ({ month, events: counts[i] }));
  })();

  return (
    <div className="space-y-6 p-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(clearError())}
              className="h-auto p-0 hover:bg-transparent"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Section */}
      <Card className="border-t-4 border-t-orange-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={currentUser?.avtar || "/avatar-placeholder.png"} alt={currentUser?.fullName || "User"} />
              <AvatarFallback className="bg-linear-to-br from-orange-500 to-amber-500 text-white text-2xl">
                {currentUser?.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{currentUser?.fullName || "User"}</h2>
                  <p className="text-muted-foreground">{currentUser?.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="text-orange-500 border-orange-500">
                      {currentUser?.departmentId}
                    </Badge>
                    {currentUser?.studentID && (
                      <p className="text-sm text-muted-foreground">
                        Roll No: {currentUser?.studentID}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-500 text-orange-500 hover:bg-orange-50"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Events ahead</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Events attended</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
            <p className="text-xs text-muted-foreground mt-1">Earned</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground mt-1">Learning hours</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events by Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={modeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {modeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Events Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="upcoming">
                Upcoming ({stats.upcomingEvents})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({stats.completedEvents})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({stats.totalEvents})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              ) : getFilteredEvents().length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No events found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Browse available events to register
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getFilteredEvents().map((event) => {
                    const registration = getRegistration(event.id);
                    const isUpcoming = new Date(event.date) > new Date();

                    return (
                      <Card
                        key={event.id}
                        className="border-l-4 border-l-orange-500/40 hover:border-l-orange-500 transition-all"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold">{event.title}</h3>
                                    <Badge className={getStatusColor(event.status)}>
                                      {event.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {event.description}
                                  </p>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-orange-500" />
                                      <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-amber-500" />
                                      <span>{format(new Date(event.date), 'hh:mm a')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4 text-blue-500" />
                                      <span>{event.venue || 'TBA'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4 text-green-500" />
                                      <span>
                                        {event.currentRegistrations}/{event.maxCapacity}
                                      </span>
                                    </div>
                                  </div>

                                  {/* {registration && (
                                    <div className="mt-3 flex items-center gap-4">
                                      <Badge variant="outline" className="text-green-600 border-green-600">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Registered
                                      </Badge>
                                      {registration.attended && (
                                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                                          Attended
                                        </Badge>
                                      )}
                                      {registration.certificateIssued && (
                                        <Badge variant="outline" className="text-amber-600 border-amber-600">
                                          <Award className="w-3 h-3 mr-1" />
                                          Certificate Available
                                        </Badge>
                                      )}
                                    </div>
                                  )} */}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewEvent(event.id)}
                                className="whitespace-nowrap"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>

                              {/* {registration?.certificateIssued && (
                                <Button
                                  size="sm"
                                  onClick={() => handleDownloadCertificate(event.id)}
                                  disabled={isLoading}
                                  className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 whitespace-nowrap"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Certificate
                                </Button>
                              )} */}

                              {isUpcoming && registration && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleCancelRegistration(event.id)}
                                  disabled={isRegistering}
                                  className="whitespace-nowrap"
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* {myRegistrations
              .filter(r => r.certificateIssued)
              .slice(0, 5)
              .map((registration) => {
                const event = myEvents.find(e => e.id === registration.eventId);
                if (!event) return null;

                return (
                  <div key={registration.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <Award className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Completed on {format(new Date(event.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadCertificate(event.id)}
                      className="text-orange-500"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })} */}

            {/* {myRegistrations.filter(r => r.certificateIssued).length === 0 && (
              <div className="text-center py-6">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No certificates yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete events to earn certificates
                </p>
              </div>
            )} */}
          </div>
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
                  <p className="text-sm text-muted-foreground">Event Title</p>
                  <p className="font-medium">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <Badge variant="outline">{selectedEvent.departmentName}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {format(new Date(selectedEvent.date), 'PPP p')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mode</p>
                  <Badge variant="outline">{selectedEvent.mode}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Venue</p>
                  <p className="font-medium">{selectedEvent.venue || 'TBA'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Organizer</p>
                  <p className="font-medium">{selectedEvent.departmentName}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedEvent.description}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Registration Status</p>
                <div className="flex items-center gap-2">
                  <Progress
                    value={(selectedEvent.currentRegistrations / selectedEvent.maxCapacity) * 100}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">
                    {selectedEvent.currentRegistrations}/{selectedEvent.maxCapacity}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}