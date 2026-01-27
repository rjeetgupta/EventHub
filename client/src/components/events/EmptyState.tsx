// components/my-events/EmptyState.tsx
import React from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  status: 'upcoming' | 'finished';
  hasAnyEvents: boolean;
}

export function EmptyState({ status, hasAnyEvents }: EmptyStateProps) {
  if (!hasAnyEvents) {
    // No events registered at all
    return (
      <Card className="border-orange-500/20">
        <CardContent className="py-16 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto">
            <Calendar className="w-10 h-10 text-orange-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">No Events Registered Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You haven't registered for any events. Start exploring campus events and join the activities that interest you!
            </p>
          </div>
          <Link href="/events">
            <Button className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8">
              <Search className="w-4 h-4 mr-2" />
              Browse Events
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (status === 'upcoming') {
    // Has events but no upcoming ones
    return (
      <Card className="border-orange-500/20">
        <CardContent className="py-16 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto">
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">No Upcoming Events</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You don't have any upcoming events registered. Check out new events and register for the ones you'd like to attend.
            </p>
          </div>
          <Link href="/events">
            <Button className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8">
              <Search className="w-4 h-4 mr-2" />
              Explore New Events
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Has events but no finished ones
  return (
    <Card className="border-orange-500/20">
      <CardContent className="py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">No Finished Events</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven't attended any events yet. Your past events and certificates will appear here once you attend registered events.
          </p>
        </div>
        <Link href="/events">
          <Button className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8">
            View Upcoming Events
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}