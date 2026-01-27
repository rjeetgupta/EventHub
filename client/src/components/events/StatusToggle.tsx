// components/events/StatusToggle.tsx
import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface StatusToggleProps {
  activeStatus: 'upcoming' | 'finished';
  onStatusChange: (status: 'upcoming' | 'finished') => void;
}

export function StatusToggle({ activeStatus, onStatusChange }: StatusToggleProps) {
  return (
    <Card className="border-orange-500/20">
      <CardContent className="p-2">
        <div className="flex gap-2">
          <Button
            variant={activeStatus === 'upcoming' ? 'default' : 'ghost'}
            className={`flex-1 transition-all duration-300 ${
              activeStatus === 'upcoming'
                ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600'
                : 'hover:bg-orange-500/10'
            }`}
            onClick={() => onStatusChange('upcoming')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming Events
          </Button>
          <Button
            variant={activeStatus === 'finished' ? 'default' : 'ghost'}
            className={`flex-1 transition-all duration-300 ${
              activeStatus === 'finished'
                ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                : 'hover:bg-green-500/10'
            }`}
            onClick={() => onStatusChange('finished')}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Finished Events
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}