'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Shield,
  Award,
  Clock,
  CheckCircle,
  UserPlus,
} from 'lucide-react';
import { User } from '@/lib/types/user.types';
import { GroupAdmin } from '@/lib/schema/department.schema';

// Reusable components
import { StatsCard } from '@/components/common/CardComponents';
import { QuickActionCard } from '@/components/common/CardComponents';
import { GroupAdminsTable } from '@/components/common/GroupAdminTable';
import { AssignGroupAdminModal } from '@/components/modals/AssignAdminModal';
import { UpdatePermissionsModal } from '@/components/modals/PermissionModal';
import { DeleteConfirmationModal } from '@/components/modals/ConfirmModal';
import { TrendChart } from '@/components/chart/TrendChart';

// Hooks
import { useDepartmentAdmin } from '@/hooks/useDepartmentAdmin';
import { useAvailableUsers } from '@/hooks/useAvailableUser';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hook';
import { useDepartmentEvents } from '@/hooks/useDepartmentEvents';

interface DepartmentAdminDashboardProps {
  currentUser: User;
}

export default function DepartmentAdminDashboard({
  currentUser,
}: DepartmentAdminDashboardProps) {
  const router = useRouter();
  const departmentId = currentUser?.departmentId!;
  // console.log("DEPARTMENT ID FROM DASHBOARD : ", departmentId)
  const { events } = useAppSelector((state) => state.events);
  const { user } = useAppSelector((state) => state.auth)
  // console.log("DEPARTMENT USER : ", user?.departmentId)
  // Custom hooks
  const {
    department,
    groupAdmins,
    availablePermissions,
    analytics,
    isLoading,
    isLoadingGroupAdmins,
    isAssigningAdmin,
    isUpdatingPermissions,
    isRemovingAdmin,
    isLoadingAnalytics,
    handleAssignGroupAdmin,
    handleUpdatePermissions,
    handleRemoveGroupAdmin,
    handleToggleStatus,
    refreshData,
  } = useDepartmentAdmin(user?.departmentId);

  const { users: availableUsers, isLoading: isLoadingUsers } =
    useAvailableUsers(departmentId);
  const { departmentEvents, eventStats } =
    useDepartmentEvents(departmentId);
  

  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<GroupAdmin | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // console.log("Event stats : ", eventStats)
  // Stats calculations
  const stats = {
    totalGroupAdmins: groupAdmins.length,
    activeGroupAdmins: groupAdmins.filter((a) => a.isActive).length,
    totalEvents: department?.stats?.totalEvents ?? 0,
    upcomingEvents: department?.stats?.upcomingEvents ?? 0,
    completedEvents: department?.stats?.completedEvents ?? 0,
    totalParticipants: department?.stats?.totalParticipants ?? 0,
    averageAttendance: department?.stats?.averageAttendance ?? 0,

    // totalEvents: eventStats.totalEvents,
    // upcomingEvents: eventStats.upcomingEvents,
    // completedEvents: eventStats.completedEvents,
    pendingEvents: eventStats.pendingEvents,
  };

  // Pending events calculation (this would come from events state in real implementation)
  const pendingEvents = 0; // TODO: Get from events slice

  // Handle assign group admin
  const onAssignAdmin = async (userId: string, permissions: any[]) => {
    const result = await handleAssignGroupAdmin(userId, permissions);
    if (result.success) {
      setIsAssignModalOpen(false);
    }
  };

  // Handle update permissions
  const onUpdatePermissions = async (permissions: any[]) => {
    if (!selectedAdmin) return;
    const result = await handleUpdatePermissions(selectedAdmin.id, permissions);
    if (result.success) {
      setIsPermissionModalOpen(false);
      setSelectedAdmin(null);
    }
  };

  // Handle remove admin
  const onRemoveAdmin = async () => {
    if (!deleteConfirmId) return;
    const result = await handleRemoveGroupAdmin(deleteConfirmId);
    if (result.success) {
      setDeleteConfirmId(null);
    }
  };

  // Handle edit admin
  const onEditAdmin = (admin: GroupAdmin) => {
    setSelectedAdmin(admin);
    setIsPermissionModalOpen(true);
  };

  // Handle toggle status
  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    await handleToggleStatus(id, currentStatus);
  };

  // Chart data
  const participationTrends =
    analytics?.participationTrends.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      participants: item.participants,
      events: item.events,
    })) ?? [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            {department?.name ?? 'Department'} Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage group admins and oversee department events
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => router.push('/events/create')}
            className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
          <Button
            onClick={() => setIsAssignModalOpen(true)}
            className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Assign Group Admin
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Group Admins"
          value={stats.totalGroupAdmins}
          subtitle={`${stats.activeGroupAdmins} active`}
          icon={Users}
          iconColor="text-orange-500"
          borderColor="border-l-orange-500"
        />

        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          subtitle={`${stats.completedEvents} completed`}
          icon={Calendar}
          iconColor="text-amber-500"
          borderColor="border-l-amber-500"
        />

        <StatsCard
          title="Pending Approval"
          value={pendingEvents}
          subtitle="Need review"
          icon={Clock}
          iconColor="text-yellow-500"
          borderColor="border-l-yellow-500"
          onClick={() => router.push('/events?status=pending')}
        />

        <StatsCard
          title="Participants"
          value={stats.totalParticipants}
          subtitle="Total registered"
          icon={Users}
          iconColor="text-blue-500"
          borderColor="border-l-blue-500"
        />

        <StatsCard
          title="Avg Attendance"
          value={`${Math.round(stats.averageAttendance)}%`}
          subtitle="Event attendance rate"
          icon={CheckCircle}
          iconColor="text-green-500"
          borderColor="border-l-green-500"
        />

        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          subtitle="Scheduled events"
          icon={TrendingUp}
          iconColor="text-purple-500"
          borderColor="border-l-purple-500"
          onClick={() => router.push('/events?status=upcoming')}
        />
      </div>

      {/* Charts Grid */}
      {!isLoadingAnalytics && participationTrends.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <TrendChart
            title="Participation Trends"
            data={participationTrends}
            dataKey="participants"
            xAxisKey="date"
            type="line"
            color="#f97316"
          />

          <TrendChart
            title="Events Timeline"
            data={participationTrends}
            dataKey="events"
            xAxisKey="date"
            type="bar"
            color="#fb923c"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <QuickActionCard
          title="Review Pending Events"
          description={`${pendingEvents} events waiting`}
          icon={Calendar}
          iconColor="text-orange-500"
          borderColor="border-orange-500/20 hover:border-orange-500/40"
          onClick={() => router.push('/events?status=pending')}
        />

        <QuickActionCard
          title="Manage Permissions"
          description={`${stats.totalGroupAdmins} admins`}
          icon={Shield}
          iconColor="text-amber-500"
          borderColor="border-amber-500/20 hover:border-amber-500/40"
          onClick={() => {
            const table = document.getElementById('group-admins-table');
            table?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <QuickActionCard
          title="View Analytics"
          description="Performance insights"
          icon={Award}
          iconColor="text-yellow-500"
          borderColor="border-yellow-500/20 hover:border-yellow-500/40"
          onClick={() => router.push('/analytics')}
        />
      </div>

      {/* Group Admins Table */}
      <Card id="group-admins-table">
        <CardHeader>
          <CardTitle>Group Administrators</CardTitle>
        </CardHeader>
        <CardContent>
          <GroupAdminsTable
            groupAdmins={groupAdmins}
            isLoading={isLoadingGroupAdmins}
            onEdit={onEditAdmin}
            onDelete={(id) => setDeleteConfirmId(id)}
            onToggleStatus={onToggleStatus}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <AssignGroupAdminModal
        open={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={onAssignAdmin}
        availableUsers={availableUsers}
        availablePermissions={availablePermissions}
        isLoading={isAssigningAdmin}
      />

      <UpdatePermissionsModal
        open={isPermissionModalOpen}
        onClose={() => {
          setIsPermissionModalOpen(false);
          setSelectedAdmin(null);
        }}
        onSubmit={onUpdatePermissions}
        groupAdmin={selectedAdmin}
        availablePermissions={availablePermissions}
        isLoading={isUpdatingPermissions}
      />

      <DeleteConfirmationModal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={onRemoveAdmin}
        isLoading={isRemovingAdmin}
      />
    </div>
  );
}