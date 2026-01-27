"use client"

import { useState, useMemo } from "react"
import { Event } from "@/lib/types/event.types" 

export function useStudentEvents(initialEvents: Event[]) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("All")

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesQuery =
        event.title.toLowerCase().includes(query.toLowerCase())

      const matchesCategory =
        category === "All" || event.category === category

      return matchesQuery && matchesCategory
    })
  }, [events, query, category])

  function register(eventId: string) {
    setEvents(prev =>
      prev.map(e =>
        e.id === eventId
          ? {
              ...e,
              isRegistered: true,
              registrationCount: e.currentRegistrations + 1,
            }
          : e
      )
    )
  }

  const participatedEvents = events.filter(e => e.registeredUsers)

  return {
    events: filteredEvents,
    participatedEvents,
    setQuery,
    setCategory,
    register,
  }
}
