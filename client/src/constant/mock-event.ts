export type EventStatus = "UPCOMING" | "FINISHED"

export type Event = {
  id: string
  title: string
  department: string
  category: string
  date: string
  status: EventStatus
}

export const EVENTS: Event[] = [
  {
    id: "1",
    title: "AI & ML Workshop",
    department: "Computer Science",
    category: "Tech",
    date: "2025-10-22",
    status: "UPCOMING",
  },
  {
    id: "2",
    title: "Cultural Fest",
    department: "Cultural Committee",
    category: "Cultural",
    date: "2025-09-01",
    status: "FINISHED",
  },
]
