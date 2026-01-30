import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit2,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Award,
  FileText,
  AlertCircle,
  Power,
  Download,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Event, EventStatus, RegistrationStatus } from '@/lib/schema/event.schema';

// TYPES

interface BaseCardProps {
  animationDelay?: number;
  className?: string;
}

interface EventCardBaseProps extends BaseCardProps {
  event: Event;
}

// STATUS BADGES

interface StatusBadgeProps {
  status: EventStatus | RegistrationStatus | 'draft' | 'pending' | 'approved' | 'finished';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'DRAFT':
      case 'draft':
        return {
          icon: FileText,
          text: 'Draft',
          className: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        };
      case 'PENDING_APPROVAL':
      case 'pending':
        return {
          icon: AlertCircle,
          text: 'Pending Review',
          className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse',
        };
      case 'APPROVED':
      case 'approved':
        return {
          icon: CheckCircle,
          text: 'Approved',
          className: 'bg-green-500/10 text-green-500 border-green-500/20',
        };
      case 'PUBLISHED':
        return {
          icon: CheckCircle,
          text: 'Open',
          className: 'bg-green-500/10 text-green-500 border-green-500/20',
        };
      case 'COMPLETED':
      case 'finished':
        return {
          icon: CheckCircle,
          text: 'Finished',
          className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        };
      case 'REGISTERED':
        return {
          icon: CheckCircle,
          text: 'Registered',
          className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        };
      case 'ATTENDED':
        return {
          icon: CheckCircle,
          text: 'Attended',
          className: 'bg-green-500/10 text-green-500 border-green-500/20',
        };
      case 'ABSENT':
        return {
          icon: XCircle,
          text: 'Missed',
          className: 'bg-red-500/10 text-red-500 border-red-500/20',
        };
      default:
        return {
          icon: AlertCircle,
          text: status,
          className: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  );
};

// EVENT INFO DISPLAY

interface EventInfoProps {
  event: Event;
  showDepartment?: boolean;
  showVenue?: boolean;
  className?: string;
}

export const EventInfo: React.FC<EventInfoProps> = ({
  event,
  showDepartment = true,
  showVenue = true,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
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

      {/* Department/Venue */}
      {(showDepartment || showVenue) && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>
            {showDepartment && event.departmentName}
            {showDepartment && showVenue && event.venue && ' • '}
            {showVenue && event.venue}
          </span>
        </div>
      )}
    </div>
  );
};

// REGISTRATION PROGRESS

interface RegistrationProgressProps {
  current: number;
  max: number;
  showLabel?: boolean;
  className?: string;
}

export const RegistrationProgress: React.FC<RegistrationProgressProps> = ({
  current,
  max,
  showLabel = true,
  className = '',
}) => {
  const percentage = (current / max) * 100;

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {current} registered
          </span>
          <span>{max} capacity</span>
        </div>
      )}
      <Progress value={percentage} className="h-1.5" />
    </div>
  );
};

// CATEGORY BADGES

interface CategoryBadgesProps {
  category: string;
  mode: string;
  departmentName?: string;
  className?: string;
}

export const CategoryBadges: React.FC<CategoryBadgesProps> = ({
  category,
  mode,
  departmentName,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Badge variant="outline" className="border-orange-500/30 text-orange-500 text-xs">
        {category}
      </Badge>
      <Badge variant="outline" className="border-blue-500/30 text-blue-500 text-xs">
        {mode}
      </Badge>
      {departmentName && (
        <Badge variant="outline" className="border-purple-500/30 text-purple-500 text-xs">
          {departmentName}
        </Badge>
      )}
    </div>
  );
};

// BASE EVENT CARD WRAPPER

interface BaseEventCardProps extends EventCardBaseProps {
  children: React.ReactNode;
  href?: string;
  badges?: React.ReactNode;
}

export const BaseEventCard: React.FC<BaseEventCardProps> = ({
  event,
  children,
  href,
  badges,
  animationDelay = 0,
  className = '',
}) => {
  const content = (
    <Card
      className={`border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 group cursor-pointer relative overflow-hidden ${className}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {badges && <div className="absolute top-3 right-3 z-10 space-y-2">{badges}</div>}
      {children}
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

// ACTION BUTTONS

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  viewLabel = 'View',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  className = '',
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {onView && (
        <Button
          size="sm"
          variant="outline"
          onClick={onView}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      {onEdit && (
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="h-8 w-8 p-0"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      )}
      {onToggleStatus && (
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleStatus}
          className="h-8 w-8 p-0"
        >
          <Power className="h-4 w-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

// STATS CARD

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  borderColor?: string;
  trend?: 'up' | 'down';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-orange-500',
  borderColor = 'border-l-orange-500',
  trend,
  className = '',
}) => {
  return (
    <Card className={`border-l-4 ${borderColor} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

// EMPTY STATE

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🔍',
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};