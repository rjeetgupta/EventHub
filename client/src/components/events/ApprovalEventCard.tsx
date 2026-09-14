'use client';

import React from 'react';
import { Calendar, Clock, Users, Building2, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/lib/schema/event.schema';
import { cn } from '@/lib/utils';

interface ApprovalEventCardProps {
  event: Event;
  isSelected: boolean;
  onClick: () => void;
  animationDelay?: number;
}

export default function ApprovalEventCard({
  event,
  isSelected,
  onClick,
  animationDelay = 0,
}: ApprovalEventCardProps) {
  return (
    <Card
      onClick={onClick}
      style={{ animationDelay: `${animationDelay}ms` }}
      className={cn(
        'cursor-pointer transition-all duration-200 hover:border-orange-500/50 hover:shadow-md',
        isSelected
          ? 'border-orange-500 shadow-md shadow-orange-500/10 bg-orange-500/5'
          : 'border-orange-500/20'
      )}
    >
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug">{event.title}</h3>
          <Badge variant="outline" className="border-orange-500/30 text-orange-500 shrink-0">
            {event.category}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-orange-500" />
            <span className="truncate">{event.departmentName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-orange-500" />
            <span>{event.maxCapacity} capacity</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {event.creatorName}
          </span>
          <span>{new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
