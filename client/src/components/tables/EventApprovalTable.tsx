// "use client"

// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { events } from "@/constant/EventDummy" 

// export function EventApprovalTable() {
//   return (
//     <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
//       <table className="w-full text-sm">
//         <thead className="bg-muted">
//           <tr>
//             <th className="px-4 py-3 text-left">Event</th>
//             <th>Status</th>
//             <th>Created By</th>
//             <th className="text-right pr-4">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {events.map((event) => (
//             <tr
//               key={event.id}
//               className="border-t transition hover:bg-muted/50"
//             >
//               <td className="px-4 py-3 font-medium">
//                 {event.title}
//               </td>

//               <td>
//                 <Badge variant="secondary">
//                   {event.status}
//                 </Badge>
//               </td>

//               <td>{event.createdBy}</td>

//               <td className="flex justify-end gap-2 px-4 py-2">
//                 <Button
//                   size="sm"
//                   variant="secondary"
//                   className="active:scale-95"
//                 >
//                   Reject
//                 </Button>
//                 <Button
//                   size="sm"
//                   className="active:scale-95"
//                 >
//                   Approve
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }
