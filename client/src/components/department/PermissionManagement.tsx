// 'use client';

// import React, { useState, useCallback } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { AlertCircle, CheckCircle, Edit2, Trash2 } from 'lucide-react';
// import { useFormErrors } from '@/hooks/useFormErrors';

// interface GroupAdmin {
//   id: string;
//   name: string;
//   email: string;
//   permissions: string[];
//   createdAt: string;
// }

// interface PermissionManagementProps {
//   groupAdmins: GroupAdmin[];
//   onAddPermission: (adminId: string, permissions: string[]) => Promise<void>;
//   onRemovePermission: (adminId: string, permissions: string[]) => Promise<void>;
//   onDeleteAdmin: (adminId: string) => Promise<void>;
//   isLoading?: boolean;
// }

// const EVENT_PERMISSIONS = [
//   { id: 'CREATE_EVENT', label: 'Create Events', description: 'Can create new events' },
//   { id: 'UPDATE_EVENT', label: 'Update Events', description: 'Can edit existing events' },
//   { id: 'DELETE_EVENT', label: 'Delete Events', description: 'Can delete events' },
//   { id: 'PUBLISH_EVENT', label: 'Publish Events', description: 'Can publish events' },
//   { id: 'VIEW_ANALYTICS', label: 'View Analytics', description: 'Can view event analytics' },
// ];

// export function PermissionManagement({
//   groupAdmins,
//   onAddPermission,
//   onRemovePermission,
//   onDeleteAdmin,
//   isLoading,
// }: PermissionManagementProps) {
//   const { errors, setGeneralError, clearAllErrors } = useFormErrors();
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedAdmin, setSelectedAdmin] = useState<GroupAdmin | null>(null);
//   const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

//   const handleOpenDialog = useCallback((admin: GroupAdmin) => {
//     setSelectedAdmin(admin);
//     setSelectedPermissions(admin.permissions);
//     setIsDialogOpen(true);
//     clearAllErrors();
//   }, [clearAllErrors]);

//   const handleCloseDialog = useCallback(() => {
//     setIsDialogOpen(false);
//     setSelectedAdmin(null);
//     setSelectedPermissions([]);
//   }, []);

//   const handlePermissionToggle = useCallback((permissionId: string) => {
//     setSelectedPermissions((prev) =>
//       prev.includes(permissionId)
//         ? prev.filter((p) => p !== permissionId)
//         : [...prev, permissionId]
//     );
//   }, []);

//   const handleSavePermissions = useCallback(async () => {
//     if (!selectedAdmin) return;

//     setIsProcessing(true);
//     clearAllErrors();

//     try {
//       // Find added and removed permissions
//       const addedPermissions = selectedPermissions.filter(
//         (p) => !selectedAdmin.permissions.includes(p)
//       );
//       const removedPermissions = selectedAdmin.permissions.filter(
//         (p) => !selectedPermissions.includes(p)
//       );

//       // Call appropriate functions
//       if (addedPermissions.length > 0) {
//         await onAddPermission(selectedAdmin.id, addedPermissions);
//       }
//       if (removedPermissions.length > 0) {
//         await onRemovePermission(selectedAdmin.id, removedPermissions);
//       }

//       if (addedPermissions.length === 0 && removedPermissions.length === 0) {
//         setGeneralError('No changes made');
//         return;
//       }

//       handleCloseDialog();
//     } catch (error) {
//       setGeneralError(error instanceof Error ? error.message : 'Failed to update permissions');
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [selectedAdmin, selectedPermissions, onAddPermission, onRemovePermission, clearAllErrors, setGeneralError, handleCloseDialog]);

//   const handleDeleteAdmin = useCallback(async (adminId: string) => {
//     setIsProcessing(true);
//     clearAllErrors();

//     try {
//       await onDeleteAdmin(adminId);
//       setDeleteConfirmId(null);
//     } catch (error) {
//       setGeneralError(error instanceof Error ? error.message : 'Failed to delete admin');
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [onDeleteAdmin, clearAllErrors, setGeneralError]);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold tracking-tight">Manage Group Admins</h2>
//         <p className="text-sm text-muted-foreground mt-1">
//           Grant or revoke event-related permissions to group administrators
//         </p>
//       </div>

//       {/* Error Alert */}
//       {errors.generalError && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{errors.generalError}</AlertDescription>
//         </Alert>
//       )}

//       {/* Group Admins Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Group Administrators</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {groupAdmins.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-muted-foreground">No group administrators found</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Email</TableHead>
//                     <TableHead>Permissions</TableHead>
//                     <TableHead>Created</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {groupAdmins.map((admin) => (
//                     <TableRow key={admin.id}>
//                       <TableCell className="font-medium">{admin.name}</TableCell>
//                       <TableCell>{admin.email}</TableCell>
//                       <TableCell>
//                         <div className="flex flex-wrap gap-1">
//                           {admin.permissions.length === 0 ? (
//                             <Badge variant="outline">No permissions</Badge>
//                           ) : (
//                             admin.permissions.map((perm) => (
//                               <Badge key={perm} variant="secondary" className="text-xs">
//                                 {perm.replace(/_/g, ' ')}
//                               </Badge>
//                             ))
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-sm text-muted-foreground">
//                         {new Date(admin.createdAt).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleOpenDialog(admin)}
//                             disabled={isLoading || isProcessing}
//                             className="h-8 w-8 p-0"
//                           >
//                             <Edit2 className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => setDeleteConfirmId(admin.id)}
//                             disabled={isLoading || isProcessing}
//                             className="h-8 w-8 p-0"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Permission Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               Manage Permissions for {selectedAdmin?.name}
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div className="space-y-3">
//               {EVENT_PERMISSIONS.map((permission) => (
//                 <div key={permission.id} className="flex items-start space-x-3">
//                   <Checkbox
//                     id={permission.id}
//                     checked={selectedPermissions.includes(permission.id)}
//                     onCheckedChange={() => handlePermissionToggle(permission.id)}
//                     disabled={isProcessing}
//                   />
//                   <div className="flex-1">
//                     <Label
//                       htmlFor={permission.id}
//                       className="font-medium cursor-pointer"
//                     >
//                       {permission.label}
//                     </Label>
//                     <p className="text-xs text-muted-foreground mt-0.5">
//                       {permission.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={handleCloseDialog}
//               disabled={isProcessing}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSavePermissions}
//               disabled={isProcessing}
//               className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
//             >
//               {isProcessing ? 'Saving...' : 'Save Permissions'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Remove Group Admin</DialogTitle>
//           </DialogHeader>

//           <p className="text-sm text-muted-foreground">
//             Are you sure you want to remove this group administrator? This action cannot be
//             undone.
//           </p>

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setDeleteConfirmId(null)}
//               disabled={isProcessing}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={() =>
//                 deleteConfirmId && handleDeleteAdmin(deleteConfirmId)
//               }
//               disabled={isProcessing}
//             >
//               {isProcessing ? 'Removing...' : 'Remove Admin'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
