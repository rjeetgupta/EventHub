// components/events/DepartmentEventCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, Edit, Eye, FileText, AlertCircle, CheckCircle, Send, Trash2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/lib/schema/event.schema';

interface DepartmentEventCardProps {
  event: Event;
  animationDelay?: number;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onSubmit?: (event: Event) => void;
  isProcessing?: boolean;
}

export function DepartmentEventCard({
  event,
  animationDelay = 0,
  onEdit,
  onDelete,
  onSubmit,
  isProcessing = false,
}: DepartmentEventCardProps) {
  const getStatusBadge = () => {
    switch (event.status) {
      case 'DRAFT':
        return (
          <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            <FileText className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case 'PENDING_APPROVAL':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'PUBLISHED':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Published
          </Badge>
        );
      case 'REGISTRATION_CLOSED':
        return (
          <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Registration Closed
          </Badge>
        );
      case 'ONGOING':
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Ongoing
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Finished
          </Badge>
        );
      default:
        return null;
    }
  };

  const registrationPercentage =
    event.maxCapacity > 0 ? (event.currentRegistrations / event.maxCapacity) * 100 : 0;

  const isDraft = event.status === 'DRAFT';
  const isEditable = event.status === 'DRAFT' || event.status === 'REJECTED';

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
              year: 'numeric',
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

        {/* Rejection reason */}
        {event.status === 'REJECTED' && event.rejectionReason && (
          <p className="text-xs text-red-500 bg-red-500/5 border border-red-500/20 rounded-md p-2">
            {event.rejectionReason}
          </p>
        )}

        {/* Registration Count */}
        {!isDraft && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center text-muted-foreground">
                <Users className="w-4 h-4 mr-1" />
                {event.currentRegistrations} registered
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
        <div className="flex flex-wrap gap-2 pt-2">
          {isEditable && onEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit(event)}
              disabled={isProcessing}
              className="flex-1 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}

          {isDraft && onSubmit && (
            <Button
              onClick={() => onSubmit(event)}
              disabled={isProcessing}
              className="flex-1 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          )}

          <Link href={`/events/${event.id}`} className="flex-1">
            <Button
              variant={isDraft ? 'outline' : 'default'}
              className={
                isDraft
                  ? 'w-full border-orange-500/30 hover:bg-orange-500/10'
                  : 'w-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
              }
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>

          {isEditable && onDelete && (
            <Button
              variant="outline"
              onClick={() => onDelete(event)}
              disabled={isProcessing}
              className="border-red-500/30 text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
