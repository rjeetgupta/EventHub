// components/department/DepartmentEventCard.tsx
import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, Edit, Eye, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DepartmentEventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    category: string;
    mode: string;
    status: 'draft' | 'pending' | 'approved' | 'finished';
    registrations: number;
    maxCapacity: number;
  };
  animationDelay?: number;
}

export function DepartmentEventCard({ event, animationDelay = 0 }: DepartmentEventCardProps) {
  const getStatusBadge = () => {
    switch (event.status) {
      case 'draft':
        return (
          <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            <FileText className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'finished':
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Finished
          </Badge>
        );
    }
  };

  const registrationPercentage = (event.registrations / event.maxCapacity) * 100;

  return (
    <Card
      className="border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group relative overflow-hidden"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        {getStatusBadge()}
      </div>

      <CardHeader className="pb-3 pt-8">
        <CardTitle className="text-lg group-hover:text-orange-500 transition-colors duration-300 pr-24">
          {event.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
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

        {/* Category & Mode */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-orange-500/30 text-orange-500 text-xs">
            {event.category}
          </Badge>
          <Badge variant="outline" className="border-blue-500/30 text-blue-500 text-xs">
            {event.mode}
          </Badge>
        </div>

        {/* Registration Count */}
        {event.status !== 'draft' && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center text-muted-foreground">
                <Users className="w-4 h-4 mr-1" />
                {event.registrations} registered
              </span>
              <span className="text-muted-foreground">{event.maxCapacity} capacity</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-orange-500 to-amber-500 transition-all duration-500"
                style={{ width: `${registrationPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {event.status === 'draft' && (
            <Link href={`/events/edit/${event.id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
          
          <Link href={`/events/${event.id}`} className="flex-1">
            <Button
              className={
                event.status === 'draft'
                  ? 'w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                  : 'w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
              }
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}