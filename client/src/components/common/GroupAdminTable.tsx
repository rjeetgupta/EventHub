'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { GroupAdmin } from '@/lib/schema/department.schema';

interface GroupAdminsTableProps {
  groupAdmins: GroupAdmin[];
  isLoading?: boolean;
  onEdit?: (admin: GroupAdmin) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, currentStatus: boolean) => void;
}

export function GroupAdminsTable({
  groupAdmins,
  isLoading = false,
  onEdit,
  onDelete,
  onToggleStatus,
}: GroupAdminsTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading group admins...</p>
      </div>
    );
  }

  if (groupAdmins.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No group admins found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Student ID</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead>Events Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groupAdmins.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell className="font-medium">{admin.userName}</TableCell>
            <TableCell>{admin.userEmail}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {admin.studentID || 'N/A'}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {admin.permissions.slice(0, 2).map((perm) => (
                  <Badge key={perm} variant="secondary" className="text-xs">
                    {perm.replace(/_/g, ' ')}
                  </Badge>
                ))}
                {admin.permissions.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{admin.permissions.length - 2}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              {admin.stats?.totalEventsCreated ?? 0}
            </TableCell>
            <TableCell>
              <Badge
                className={
                  admin.isActive
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                }
              >
                {admin.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(admin.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {onToggleStatus && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToggleStatus(admin.id, admin.isActive)}
                    className="h-8 w-8 p-0"
                    title={admin.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {admin.isActive ? (
                      <ToggleRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                )}
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(admin)}
                    className="h-8 w-8 p-0"
                    title="Edit Permissions"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(admin.id)}
                    className="h-8 w-8 p-0"
                    title="Remove Admin"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}