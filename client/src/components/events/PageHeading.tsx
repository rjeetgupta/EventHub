// components/events/PageHeading.tsx
import React from 'react';
import { Calendar } from 'lucide-react';

export function PageHeading() {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-orange-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Browse Events</h1>
      </div>
      <p className="text-muted-foreground text-lg">
        Events from all departments
      </p>
    </div>
  );
}