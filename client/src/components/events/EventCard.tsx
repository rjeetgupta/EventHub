'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Eye, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from "@/lib/types/event.types";
import { EventStatus } from '@/lib/types/common.types';

interface EventCardProps {
  event: Event;
  isLoggedIn: boolean;
  isRegistered: boolean;
  animationDelay?: number;
}

export function EventCard({ event, isLoggedIn, isRegistered, animationDelay = 0 }: EventCardProps) {
  const isUpcoming = event.status === EventStatus.PUBLISHED;
  const registrationPercentage = (event.currentRegistrations / event.maxCapacity) * 100;
  const isClosingSoon = registrationPercentage > 85;

  const getCTAButton = () => {
    // Public user
    if (!isLoggedIn) {
      return (
        <div className="space-y-2">
          <Link href="/login" className="block">
            <Button className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold transition-all duration-300 hover:scale-105">
              Login to Register
            </Button>
          </Link>
          <Link href="/register" className="block">
            <Button variant="outline" className="w-full border-orange-500/30 hover:bg-orange-500/10 text-sm">
              Create Account
            </Button>
          </Link>
        </div>
      );
    }

    // Logged-in student - Upcoming event
    if (isUpcoming) {
      if (isRegistered) {
        return (
          <Button 
            disabled 
            className="w-full bg-green-500/20 text-green-500 border-green-500/30 cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Registered
          </Button>
        );
      }
      
      return (
        <Button className="w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold transition-all duration-300 hover:scale-105">
          Register Now
        </Button>
      );
    }

    // Logged-in student - Finished event
    return (
      <Link href={`/events/${event.id}`}>
        <Button variant="outline" className="w-full border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </Link>
    );
  };

  return (
    <Card
      className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer relative overflow-hidden"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        {isUpcoming ? (
          <Badge 
            className={`${
              isClosingSoon 
                ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' 
                : 'bg-green-500/10 text-green-500 border-green-500/20'
            }`}
          >
            {isClosingSoon ? 'Closing Soon' : 'Open'}
          </Badge>
        ) : (
          <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            Finished
          </Badge>
        )}
      </div>

      <Link href={`/events/${event.id}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg group-hover:text-orange-500 transition-colors duration-300 pr-20">
            {event.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Date & Time */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{event.time}</span>
          </div>

          {/* Department */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{event.departmentName}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-orange-500/30 text-orange-500 text-xs">
              {event.category}
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-500 text-xs">
              {event.mode}
            </Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-500 text-xs">
              {event.departmentName}
            </Badge>
          </div>

          {/* Registration Progress (Upcoming only) */}
          {isUpcoming && (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {event.currentRegistrations} registered
                </span>
                <span>{event.maxCapacity} capacity</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-orange-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${registrationPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Participants Count (Finished only) */}
          {!isUpcoming && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{event.currentRegistrations} participants</span>
            </div>
          )}
        </CardContent>
      </Link>

      {/* CTA Section */}
      <CardContent className="pt-0">
        {getCTAButton()}
      </CardContent>
    </Card>
  );
}