// 'use client';

// import React from 'react';
// import { ApprovalManagement } from '@/components/department/ApprovalManagement';
// import { useCanApproveEvent } from '@/lib/usePermissions';
// import { User } from "@/lib/types/user.types";
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { AlertCircle } from 'lucide-react';

// interface ApprovalPageProps {
//   currentUser: User;
// }

// export function ApprovalPage({ currentUser }: ApprovalPageProps) {
//   const canApprove = useCanApproveEvent(currentUser);

//   if (!canApprove) {
//     return (
//       <div className="space-y-4">
//         <h1 className="text-3xl font-bold">Event Approvals</h1>
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>
//             You do not have permission to access event approvals. Only department admins and
//             system admins can manage event approvals.
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return <ApprovalManagement currentUser={currentUser} />;
// }
