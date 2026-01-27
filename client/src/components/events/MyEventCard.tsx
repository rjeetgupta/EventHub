'use client'
import Link from 'next/link';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Award, Eye, Download, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MyEventCardProps {
  event: {
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
  };
  animationDelay?: number;
}

export function MyEventCard({ event, animationDelay = 0 }: MyEventCardProps) {
  const getStatusBadge = () => {
    switch (event.registrationStatus) {
      case 'registered':
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Registered
          </Badge>
        );
      case 'attended':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Attended
          </Badge>
        );
      case 'missed':
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Missed
          </Badge>
        );
    }
  };

  return (
    <Card
      className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer relative overflow-hidden"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        {getStatusBadge()}
      </div>

      {/* Certificate Badge */}
      {event.certificateAvailable && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <Award className="w-3 h-3 mr-1" />
            Certificate
          </Badge>
        </div>
      )}

      <Link href={`/events/${event.id}`}>
        <CardHeader className="pb-3 pt-12">
          <CardTitle className="text-lg group-hover:text-orange-500 transition-colors duration-300">
            {event.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Date & Time */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{event.time}</span>
          </div>

          {/* Department */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{event.department}</span>
          </div>

          {/* Category & Mode Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-orange-500/30 text-orange-500 text-xs">
              {event.category}
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-500 text-xs">
              {event.mode}
            </Badge>
          </div>
        </CardContent>
      </Link>

      {/* Action Buttons */}
      <CardContent className="pt-0 space-y-2">
        <Link href={`/events/${event.id}`}>
          <Button
            variant="outline"
            className="w-full border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </Link>

        {event.certificateAvailable && (
          <Button className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold">
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </Button>
        )}

        {event.hasResults && event.status === 'finished' && (
          <Button
            variant="outline"
            className="w-full border-purple-500/30 text-purple-500 hover:bg-purple-500/10"
          >
            <Trophy className="w-4 h-4 mr-2" />
            View Results
          </Button>
        )}
      </CardContent>
    </Card>
  );
}