// app/events/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Globe, Bell, Download, Award, CheckCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from "@/lib/types/event.types";
import Spinner from '@/components/common/Spinner';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { cancelEventRegistration, clearCurrentEvent, fetchEventById, registerForEvent } from '@/store/slices/eventsSlice';
import { toast } from 'sonner';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const eventId = params.id as string;

  const [reminderEnabled, setReminderEnabled] = useState(false);

  const { currentEvent, isLoading, isRegistering, error } = useAppSelector(
    (state) => state.events
  );
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const isLoggedIn = isAuthenticated;
  const userId = user?.id;

  // Fetch event on mount
  useEffect(() => {
    dispatch(fetchEventById(eventId));

    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [dispatch, eventId]);

  const event = currentEvent;
  const isRegistered = event?.registeredUsers?.includes(userId || '') || false;
  const isUpcoming = event && new Date(event.date) >= new Date();

  const handleRegister = async () => {
    try {
      await dispatch(registerForEvent(eventId)).unwrap();
      toast.success('Successfully registered for the event!');
    } catch (err: any) {
      toast.error(err || 'Failed to register for event');
    }
  };

  const handleCancelRegistration = async () => {
    if (!confirm('Are you sure you want to cancel your registration?')) return;

    try {
      await dispatch(cancelEventRegistration(eventId)).unwrap();
      toast.success('Registration cancelled successfully');
    } catch (err: any) {
      toast.error(err || 'Failed to cancel registration');
    }
  };

  // const handleDownloadCertificate = async () => {
  //   try {
  //     await dispatch(downloadEventCertificate(eventId)).unwrap();
  //     toast.success('Certificate downloaded successfully');
  //   } catch (err: any) {
  //     toast.error(err || 'Failed to download certificate');
  //   }
  // };

  // Loading state
  if (isLoading) {
    return (
      <Spinner />
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold mb-2">Event Not Found</h3>
          <p className="text-muted-foreground mb-6">{error || 'This event does not exist'}</p>
          <Button onClick={() => router.push('/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }


  // This would come from your API/database
  // const isLoggedIn = false; // Change based on auth state
  // const userId = null; // User ID if logged in

  // // Mock event data - replace with actual API call
  // const event: Event = {
  //   id: eventId,
  //   title: 'AI & Machine Learning Workshop',
  //   date: '2024-12-25',
  //   time: '10:00 AM - 4:00 PM',
  //   department: 'Computer Science',
  //   category: 'Workshop',
  //   mode: 'Hybrid',
  //   status: 'upcoming',
  //   registrations: 245,
  //   maxCapacity: 300,
  //   registeredUsers: [],
  //   description: 'Join us for an intensive workshop on AI and Machine Learning. Learn from industry experts about the latest trends, tools, and techniques in artificial intelligence. This hands-on workshop will cover neural networks, deep learning, and practical applications.',
  //   venue: 'Auditorium A, Main Campus',
  //   organizerName: 'Dr. Sarah Johnson',
  //   organizerEmail: 'sarah.johnson@college.edu',
  //   agenda: [
  //     '10:00 AM - Introduction to AI',
  //     '11:30 AM - Neural Networks Basics',
  //     '1:00 PM - Lunch Break',
  //     '2:00 PM - Hands-on Deep Learning',
  //     '3:30 PM - Q&A Session'
  //   ],
  //   certificateAvailable: true
  // };

  // const [reminderEnabled, setReminderEnabled] = useState(false);
  // const isRegistered = event.registeredUsers?.includes(userId || '') || false;
  // const isUpcoming = event.status === 'upcoming';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/events">
          <Button variant="ghost" className="mb-6 hover:bg-orange-500/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </Link>

        {/* Event Header */}
        <Card className="border-orange-500/20 mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                    {event.category}
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-500">
                    {event.mode}
                  </Badge>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-500">
                    {event.departmentName}
                  </Badge>
                  {isUpcoming && event.status === 'PUBLISHED' &&(
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                      Open for Registration
                    </Badge>
                  )}
                  {!isUpcoming && (
                    <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                      Event Finished
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-3xl md:text-4xl">{event.title}</CardTitle>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span>{event.venue || 'Venue TBA'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-orange-500" />
                    <span>{event.mode}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Agenda */}
            {/* {event.agenda && event.agenda.length > 0 && (
              <Card className="border-orange-500/20">
                <CardHeader>
                  <CardTitle>Event Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {event.agenda.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-orange-500" />
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )} */}

            {/* Organizer (Public only) */}
            {!isLoggedIn && (
              <Card className="border-orange-500/20">
                <CardHeader>
                  <CardTitle>Organizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">{event.creatorName}</p>
                    <p className="text-sm text-muted-foreground">{event.departmentName}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Winner/Results (Finished events only, logged in) */}
            {/* {!isUpcoming && isLoggedIn && event.winner && (
              <Card className="border-orange-500/20 bg-linear-to-br from-amber-500/5 to-orange-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-amber-500" />
                    <span>Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">🏆</div>
                    <div>
                      <p className="font-semibold text-lg">Winner: {event.winner}</p>
                      <p className="text-sm text-muted-foreground">Congratulations to the winning team!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="border-orange-500/20 sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  {isUpcoming ? 'Registration' : 'Event Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Registration Count */}
                {isUpcoming && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-1" />
                        {event.currentRegistrations} registered
                      </span>
                      <span className="text-muted-foreground">{event.maxCapacity} capacity</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-orange-500 to-amber-500"
                        style={{ width: `${(event.currentRegistrations / event.maxCapacity) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Participants (Finished) */}
                {!isUpcoming && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <span>{event.currentRegistrations} participants attended</span>
                  </div>
                )}

                {/* CTA Buttons */}
                {!isLoggedIn && (
                  <div className="space-y-2">
                    <Link href="/login">
                      <Button className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold">
                        Login to Register
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="outline" className="w-full border-orange-500/30 hover:bg-orange-500/10">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                )}

                {isLoggedIn && isUpcoming && !isRegistered && (
                  <Button
                  onClick={handleRegister}
                  disabled={isRegistering || event.currentRegistrations >= event.maxCapacity}
                    className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold">
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : event.currentRegistrations >= event.maxCapacity ? (
                      'Event Full'
                    ) : (
                      'Register for Event'
                    )}
                  </Button>
                )}

                {isLoggedIn && isUpcoming && isRegistered && (
                  <div className="space-y-2">
                    <Button disabled className="w-full bg-green-500/20 text-green-500 border-green-500/30">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      You're Registered
                    </Button>
                    <Button
                      onClick={handleCancelRegistration}
                      disabled={isRegistering}
                      variant="outline"
                      className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10">
                      <X className="w-4 h-4 mr-2" />
                      {isRegistering ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Cancel Registration
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Reminder Toggle (Logged in, upcoming, registered) */}
                {isLoggedIn && isUpcoming && isRegistered && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">Event Reminder</span>
                    </div>
                    <button
                      onClick={() => setReminderEnabled(!reminderEnabled)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        reminderEnabled ? 'bg-orange-500' : 'bg-muted-foreground/30'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          reminderEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )}

                {/* Attendance Status (Finished, logged in) */}
                {!isUpcoming && isLoggedIn && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">You attended this event</span>
                    </div>
                  </div>
                )}

                {/* Certificate Download (Finished, logged in, certificate available) */}
                {/* {!isUpcoming && isLoggedIn && event.certificateAvailable && (
                  <Button
                    onClick={handleDownloadCertificate}
                    className="w-full bg-linear-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                )} */}
              </CardContent>
            </Card>

            {/* Organizer Card (Logged in) */}
            {isLoggedIn && (
              <Card className="border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">Organized By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">{event.creatorName}</p>
                    <p className="text-sm text-muted-foreground">{event.departmentName}</p>
                    <Button variant="outline" className="w-full mt-2 border-orange-500/30 hover:bg-orange-500/10 text-sm">
                      Contact Organizer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}