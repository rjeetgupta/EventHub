'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, Users, Calendar, TrendingUp, AlertCircle, Plus, 
  Edit2, Trash2, Power, Shield, Activity, CheckCircle, XCircle, Send
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { createDepartment, deleteDepartment, fetchDepartments, updateDepartment } from '@/store/slices/departmentSlice';
import {
  fetchAllEvents,
  handleEventApproval,
  publishEvent as publishEventThunk,
  deleteEvent as deleteEventThunk,
} from '@/store/slices/eventsSlice';
import { toast } from 'sonner';
import { CreateDepartmentRequest, UpdateDepartmentRequest } from "@/lib/schema/department.schema";
import { 
  DashboardHeader, 
  StatsGrid, 
  LineChartCard, 
  BarChartCard,
  PieChartCard,
  DataTable,
  ActivityFeed,
  ActionButtons 
} from "@/components/common/Dashboardcomponents";

export default function SuperAdminDashboard() {
  const CHART_COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

  const dispatch = useAppDispatch();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    adminFullName: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { departments, isLoading, isCreatingDepartment, isUpdatingDepartment, isDeletingDepartment } = useAppSelector((state) => state.departments);
  const { allEvents, isLoading: isEventsLoading } = useAppSelector((state) => state.events);
  const [eventDeleteConfirmId, setEventDeleteConfirmId] = useState<string | null>(null);

  // Stats
  const stats = [
    {
      title: 'Total Departments',
      value: departments?.length || 0,
      subtitle: `${departments?.filter(d => d.admin?.isActive)?.length || 0} active`,
      icon: Building2,
      iconColor: 'text-orange-500',
      borderColor: 'border-l-orange-500',
    },
    {
      title: 'Total Events',
      value: departments?.reduce((sum, d) => sum + (d.stats?.totalEvents || 0), 0) || 0,
      subtitle: `${departments?.reduce((sum, d) => sum + (d.stats?.upcomingEvents || 0), 0) || 0} active`,
      icon: Calendar,
      iconColor: 'text-amber-500',
      borderColor: 'border-l-amber-500',
    },
    {
      title: 'Total Students',
      value: departments?.reduce((sum, d) => sum + (d.stats?.totalParticipants || 0), 0) || 0,
      subtitle: 'Registered users',
      icon: Users,
      iconColor: 'text-orange-400',
      borderColor: 'border-l-orange-400',
    },
    {
      title: 'Pending Approvals',
      value: 0,
      subtitle: 'Require action',
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
      borderColor: 'border-l-yellow-500',
    },
    {
      title: 'System Health',
      value: '98.5%',
      subtitle: 'Uptime',
      icon: Activity,
      iconColor: 'text-green-500',
      borderColor: 'border-l-green-500',
    },
    {
      title: 'Growth',
      value: '+12.5%',
      subtitle: 'This month',
      icon: TrendingUp,
      iconColor: 'text-blue-500',
      borderColor: 'border-l-blue-500',
    },
  ];

  // Chart data
  const eventTrendData = [
    { month: 'Jan', events: 12 },
    { month: 'Feb', events: 19 },
    { month: 'Mar', events: 15 },
    { month: 'Apr', events: 25 },
    { month: 'May', events: 22 },
    { month: 'Jun', events: 30 },
  ];

  const departmentEventData = departments?.map(dept => ({
    name: dept.code,
    events: dept.stats?.totalEvents ?? 0,
  })) || [];

  const participationData = [
    { name: 'Registered', value: 1850 },
    { name: 'Attended', value: 1420 },
    { name: 'Completed', value: 1200 },
    { name: 'Certified', value: 980 },
  ];

  const activities = [
    {
      id: '1',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      title: 'Event Approved',
      description: '"Tech Fest 2024" by CSE Department',
      time: '2 hours ago',
    },
    {
      id: '2',
      icon: Plus,
      iconColor: 'text-blue-500',
      title: 'New Department Created',
      description: '"Artificial Intelligence" department',
      time: '5 hours ago',
    },
    {
      id: '3',
      icon: XCircle,
      iconColor: 'text-red-500',
      title: 'Event Rejected',
      description: '"Workshop" by ECE - Incomplete details',
      time: '1 day ago',
    },
    {
      id: '4',
      icon: Shield,
      iconColor: 'text-amber-500',
      title: 'Admin Assigned',
      description: 'New department admin for ME',
      time: '2 days ago',
    },
  ];

  // Table columns
  const departmentColumns = [
    { header: 'Department', accessor: 'name' as const, cell: (value: string) => <span className="font-medium">{value}</span> },
    { header: 'Code', accessor: 'code' as const, cell: (value: string) => <Badge variant="outline">{value}</Badge> },
    { header: 'Admin', accessor: (row: any) => row.admin?.fullName || '-' },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <Badge className={row.admin?.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}>
          {row.admin?.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { header: 'Events', accessor: (row: any) => row.stats?.totalEvents || 0 },
    { header: 'Students', accessor: (row: any) => row.stats?.totalParticipants || 0 },
    { header: 'Created', accessor: (row: any) => new Date(row.createdAt).toLocaleDateString(), className: 'text-sm text-muted-foreground' },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <ActionButtons buttons={[
          { icon: Edit2, onClick: () => openEditModal(row.id) },
          { icon: Power, onClick: () => handleToggleStatus(row) },
          { icon: Trash2, onClick: () => setDeleteConfirmId(row.id), variant: 'destructive' },
        ]} />
      ),
      className: 'text-right'
    },
  ];

  const handleApproveEvent = async (eventId: string) => {
    try {
      await dispatch(handleEventApproval({ eventId, data: { action: 'approve' } })).unwrap();
      await dispatch(publishEventThunk(eventId)).unwrap();
      toast.success('Event approved and published');
    } catch (err: any) {
      toast.error(err || 'Failed to approve event');
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    try {
      await dispatch(
        handleEventApproval({ eventId, data: { action: 'reject', feedback: 'Rejected by Admin' } })
      ).unwrap();
      toast.success('Event rejected');
    } catch (err: any) {
      toast.error(err || 'Failed to reject event');
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    try {
      await dispatch(publishEventThunk(eventId)).unwrap();
      toast.success('Event published');
    } catch (err: any) {
      toast.error(err || 'Failed to publish event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await dispatch(deleteEventThunk(eventId)).unwrap();
      toast.success('Event deleted');
      setEventDeleteConfirmId(null);
    } catch (err: any) {
      toast.error(err || 'Failed to delete event');
    }
  };

  const eventStatusColor: Record<string, string> = {
    DRAFT: 'bg-gray-500 hover:bg-gray-600',
    PENDING_APPROVAL: 'bg-yellow-500 hover:bg-yellow-600',
    REJECTED: 'bg-red-500 hover:bg-red-600',
    APPROVED: 'bg-green-500 hover:bg-green-600',
    PUBLISHED: 'bg-green-500 hover:bg-green-600',
    REGISTRATION_CLOSED: 'bg-purple-500 hover:bg-purple-600',
    ONGOING: 'bg-blue-500 hover:bg-blue-600',
    COMPLETED: 'bg-gray-400 hover:bg-gray-500',
  };

  const eventColumns = [
    { header: 'Title', accessor: 'title' as const, cell: (value: string) => <span className="font-medium">{value}</span> },
    { header: 'Department', accessor: (row: any) => row.departmentName || '-' },
    { header: 'Category', accessor: (row: any) => <Badge variant="outline">{row.category}</Badge> },
    {
      header: 'Status',
      accessor: (row: any) => (
        <Badge className={eventStatusColor[row.status] || 'bg-gray-500'}>
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    { header: 'Date', accessor: (row: any) => new Date(row.date).toLocaleDateString(), className: 'text-sm text-muted-foreground' },
    { header: 'Registrations', accessor: (row: any) => `${row.currentRegistrations}/${row.maxCapacity}` },
    {
      header: 'Actions',
      accessor: (row: any) => {
        const buttons = [];
        if (row.status === 'PENDING_APPROVAL') {
          buttons.push({ icon: CheckCircle, onClick: () => handleApproveEvent(row.id) });
          buttons.push({ icon: XCircle, onClick: () => handleRejectEvent(row.id), variant: 'destructive' as const });
        }
        if (row.status === 'APPROVED') {
          buttons.push({ icon: Send, onClick: () => handlePublishEvent(row.id) });
        }
        buttons.push({ icon: Trash2, onClick: () => setEventDeleteConfirmId(row.id), variant: 'destructive' as const });
        return <ActionButtons buttons={buttons} />;
      },
      className: 'text-right',
    },
  ];

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const validateForm = useCallback((isEdit: boolean = false): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Department name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!formData.code.trim()) {
      errors.code = 'Department code is required';
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      errors.code = 'Code must be uppercase letters and numbers only';
    }

    if (!isEdit) {
      if (!formData.adminFullName.trim()) {
        errors.adminFullName = 'Admin name is required';
      }

      if (!formData.adminEmail.trim()) {
        errors.adminEmail = 'Admin email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
        errors.adminEmail = 'Invalid email format';
      }

      if (!formData.adminPassword) {
        errors.adminPassword = 'Password is required';
      } else if (formData.adminPassword.length < 8) {
        errors.adminPassword = 'Password must be at least 8 characters';
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.adminPassword)) {
        errors.adminPassword = 'Password must contain uppercase, lowercase, and number';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleCreateDepartment = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(createDepartment(formData as CreateDepartmentRequest)).unwrap();
      toast.success('Department created successfully');
      setIsCreateModalOpen(false);
      setFormData({ name: '', code: '', description: '', adminFullName: '', adminEmail: '', adminPassword: '' });
      setFormErrors({});
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create department');
      if (err.errors) setFormErrors(err.errors);
    }
  };

  const openEditModal = useCallback((deptId: string) => {
    const dept = departments?.find(d => d.id === deptId);
    if (!dept) return;

    setSelectedDepartmentId(deptId);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      adminFullName: dept.admin?.fullName || '',
      adminEmail: dept.admin?.email || '',
      adminPassword: '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  }, [departments]);

  const handleUpdateDepartment = async () => {
    if (!validateForm(true) || !selectedDepartmentId) return;

    try {
      await dispatch(updateDepartment({
        id: selectedDepartmentId,
        data: {
          name: formData.name,
          code: formData.code,
          description: formData.description,
        } as UpdateDepartmentRequest,
      })).unwrap();

      toast.success('Department updated successfully');
      setIsEditModalOpen(false);
      setSelectedDepartmentId(null);
      setFormData({ name: '', code: '', description: '', adminFullName: '', adminEmail: '', adminPassword: '' });
      setFormErrors({});
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update department');
      if (err.errors) setFormErrors(err.errors);
    }
  };

  const handleToggleStatus = async (dept: any) => {
    if (!dept.admin) {
      toast.error('No department admin found');
      return;
    }

    try {
      await dispatch(updateDepartment({ id: dept.id, data: { isActive: !dept.admin.isActive } })).unwrap();
      toast.success('Department admin status updated');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      await dispatch(deleteDepartment(id)).unwrap();
      toast.success('Department deleted successfully');
      setDeleteConfirmId(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete department');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        title="Super Admin Dashboard"
        subtitle="Manage departments, events, and system-wide operations"
        actionButton={{
          label: 'Create Department',
          icon: Plus,
          onClick: () => {
            setFormData({ name: '', code: '', description: '', adminFullName: '', adminEmail: '', adminPassword: '' });
            setFormErrors({});
            setIsCreateModalOpen(true);
          },
          disabled: isCreatingDepartment,
        }}
      />

      <StatsGrid stats={stats} />

      <div className="grid gap-4 md:grid-cols-2">
        <LineChartCard title="Event Trends" data={eventTrendData} dataKey="events" xAxisKey="month" />
        <BarChartCard title="Events by Department" data={departmentEventData} dataKey="events" xAxisKey="name" />
        <PieChartCard title="Participation Overview" data={participationData} colors={CHART_COLORS} />
        <ActivityFeed title="Recent Activity" activities={activities} />
      </div>

      <DataTable
        title="Department Management"
        columns={departmentColumns}
        data={departments || []}
        isLoading={isLoading}
        emptyMessage="No departments found"
      />

      <DataTable
        title="All Events (All Departments)"
        columns={eventColumns}
        data={allEvents || []}
        isLoading={isEventsLoading}
        emptyMessage="No events found"
      />

      {/* Delete Event Confirmation */}
      <Dialog open={!!eventDeleteConfirmId} onOpenChange={() => setEventDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete this event. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => eventDeleteConfirmId && handleDeleteEvent(eventDeleteConfirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Department Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Computer Science"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Department Code *</Label>
              <Input
                id="code"
                placeholder="e.g., CSE"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className={formErrors.code ? 'border-red-500' : ''}
              />
              {formErrors.code && <p className="text-xs text-red-500">{formErrors.code}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminFullName">Admin Name *</Label>
              <Input
                id="adminFullName"
                placeholder="e.g., John Doe"
                value={formData.adminFullName}
                onChange={(e) => setFormData({ ...formData, adminFullName: e.target.value })}
                className={formErrors.adminFullName ? 'border-red-500' : ''}
              />
              {formErrors.adminFullName && <p className="text-xs text-red-500">{formErrors.adminFullName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email *</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="e.g., admin@example.com"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                className={formErrors.adminEmail ? 'border-red-500' : ''}
              />
              {formErrors.adminEmail && <p className="text-xs text-red-500">{formErrors.adminEmail}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Password *</Label>
              <Input
                id="adminPassword"
                type="password"
                placeholder="Min 8 chars, uppercase, lowercase, number"
                value={formData.adminPassword}
                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                className={formErrors.adminPassword ? 'border-red-500' : ''}
              />
              {formErrors.adminPassword && <p className="text-xs text-red-500">{formErrors.adminPassword}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} disabled={isCreatingDepartment}>
              Cancel
            </Button>
            <Button onClick={handleCreateDepartment} disabled={isCreatingDepartment} className="bg-gradient-to-r from-orange-500 to-amber-500">
              {isCreatingDepartment ? 'Creating...' : 'Create Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Department Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-code">Department Code *</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className={formErrors.code ? 'border-red-500' : ''}
              />
              {formErrors.code && <p className="text-xs text-red-500">{formErrors.code}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isUpdatingDepartment}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDepartment} disabled={isUpdatingDepartment} className="bg-gradient-to-r from-orange-500 to-amber-500">
              {isUpdatingDepartment ? 'Updating...' : 'Update Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This will permanently delete the department and all associated data. This action cannot be undone.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} disabled={isDeletingDepartment}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDeleteDepartment(deleteConfirmId)}
              disabled={isDeletingDepartment}
            >
              {isDeletingDepartment ? 'Deleting...' : 'Delete Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}