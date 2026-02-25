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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Permission, PermissionDefinition, GroupAdmin } from '@/lib/schema/department.schema';

interface UpdatePermissionsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (permissions: Permission[]) => void;
  groupAdmin: GroupAdmin | null;
  availablePermissions: PermissionDefinition[];
  isLoading?: boolean;
}

export function UpdatePermissionsModal({
  open,
  onClose,
  onSubmit,
  groupAdmin,
  availablePermissions,
  isLoading = false,
}: UpdatePermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && groupAdmin) {
      setSelectedPermissions(groupAdmin.permissions);
      setError(null);
    }
  }, [open, groupAdmin]);

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
    if (selectedPermissions.length === 0) {
      setError('Please select at least one permission');
      return;
    }

    // Check permission dependencies
    if (
      selectedPermissions.includes('ASSIGN_PERMISSIONS') &&
      !selectedPermissions.includes('MANAGE_GROUP_ADMINS')
    ) {
      setError('ASSIGN_PERMISSIONS requires MANAGE_GROUP_ADMINS permission');
      return;
    }

    onSubmit(selectedPermissions);
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
          <DialogTitle>
            Manage Permissions - {groupAdmin?.userName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {Object.entries(groupedPermissions).map(([category, perms]) => (
            <div key={category} className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">
                {category}
              </p>
              <div className="space-y-2 pl-4">
                {perms.map((permission) => (
                  <div key={permission.name} className="flex items-start space-x-2">
                    <Checkbox
                      id={`edit-${permission.name}`}
                      checked={selectedPermissions.includes(permission.name)}
                      onCheckedChange={() => togglePermission(permission.name)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={`edit-${permission.name}`}
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
          ))}

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
            disabled={isLoading || selectedPermissions.length === 0}
          >
            {isLoading ? 'Updating...' : 'Update Permissions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}