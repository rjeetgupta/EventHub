'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Permission, PermissionDefinition } from '@/lib/schema/department.schema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  studentID?: string;
}

interface AssignGroupAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: string, permissions: Permission[]) => void;
  availableUsers: User[];
  availablePermissions: PermissionDefinition[];
  isLoading?: boolean;
}

export function AssignGroupAdminModal({
  open,
  onClose,
  onSubmit,
  availableUsers,
  availablePermissions,
  isLoading = false,
}: AssignGroupAdminModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedUserId('');
      setSelectedPermissions([]);
      setError(null);
    }
  }, [open]);

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      }
      return [...prev, permission];
    });
    setError(null);
  };

  const handleSubmit = () => {
    // Validation
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }

    if (selectedPermissions.length === 0) {
      setError('Please select at least one permission');
      return;
    }

    // Check if ASSIGN_PERMISSIONS requires MANAGE_GROUP_ADMINS
    if (
      selectedPermissions.includes('ASSIGN_PERMISSIONS') &&
      !selectedPermissions.includes('MANAGE_GROUP_ADMINS')
    ) {
      setError('ASSIGN_PERMISSIONS requires MANAGE_GROUP_ADMINS permission');
      return;
    }

    onSubmit(selectedUserId, selectedPermissions);
  };

  // Group permissions by category
  const groupedPermissions = availablePermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, PermissionDefinition[]>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Group Admin</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="user">Select User *</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No users available
                  </div>
                ) : (
                  availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                      {user.studentID && ` - ${user.studentID}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Permissions Selection */}
          <div className="space-y-3">
            <Label>Permissions *</Label>
            
            {Object.keys(groupedPermissions).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No permissions available
              </p>
            ) : (
              Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category} className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {category}
                  </p>
                  <div className="space-y-2 pl-4">
                    {perms.map((permission) => (
                      <div key={permission.name} className="flex items-start space-x-2">
                        <Checkbox
                          id={permission.name}
                          checked={selectedPermissions.includes(permission.name)}
                          onCheckedChange={() => togglePermission(permission.name)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={permission.name}
                            className="cursor-pointer font-normal"
                          >
                            {permission.name.replace(/_/g, ' ')}
                          </Label>
                          {permission.description && (
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            disabled={isLoading || !selectedUserId || selectedPermissions.length === 0}
          >
            {isLoading ? 'Assigning...' : 'Assign Admin'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}