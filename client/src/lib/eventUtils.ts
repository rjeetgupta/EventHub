// // lib/eventUtils.ts
// import { Event } from './types/event.types'; 
// import { EventFilters } from '@/hooks/useEventFilters';

// export function filterAndSortEvents(
//   events: Event[],
//   status: 'upcoming' | 'finished',
//   filters: EventFilters
// ): Event[] {
//   let filtered = events.filter(event => event.status === status);

//   // Apply department filter
//   if (filters.departments.length > 0) {
//     filtered = filtered.filter(event =>
//       filters.departments.includes(event.department) ||
//       event.department === 'All Departments'
//     );
//   }

//   // Apply category filter
//   if (filters.categories.length > 0) {
//     filtered = filtered.filter(event =>
//       filters.categories.includes(event.category)
//     );
//   }

//   // Apply mode filter
//   if (filters.mode !== 'All') {
//     filtered = filtered.filter(event => event.mode === filters.mode);
//   }

//   // Apply date range filter
//   if (filters.dateRange !== 'all') {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     filtered = filtered.filter(event => {
//       const eventDate = new Date(event.date);

//       switch (filters.dateRange) {
//         case 'today':
//           return eventDate.toDateString() === today.toDateString();
//         case 'week':
//           const weekEnd = new Date(today);
//           weekEnd.setDate(weekEnd.getDate() + 7);
//           return eventDate >= today && eventDate <= weekEnd;
//         case 'month':
//           const monthEnd = new Date(today);
//           monthEnd.setMonth(monthEnd.getMonth() + 1);
//           return eventDate >= today && eventDate <= monthEnd;
//         default:
//           return true;
//       }
//     });
//   }

//   // Sort events
//   filtered.sort((a, b) => {
//     const dateA = new Date(a.date).getTime();
//     const dateB = new Date(b.date).getTime();

//     if (status === 'upcoming') {
//       // Soonest first for upcoming
//       return dateA - dateB;
//     } else {
//       // Most recent first for finished
//       return dateB - dateA;
//     }
//   });

//   return filtered;
// }