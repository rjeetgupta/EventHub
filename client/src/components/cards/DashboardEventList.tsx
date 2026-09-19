import { CalendarDays, Clock } from "lucide-react";
import { dashboardStatusClass } from "@/constant/dashboard";
import { DashboardCard, DashboardCardHeader } from "@/components/cards/DashboardCard";

export type DashboardEvent = {
  title: string;
  date: string;
  venue: string;
  status?: string;
  image?: string;
};

export function DashboardEventList({
  events,
  title = "Upcoming Events",
  showStatus = true,
  viewAllHref,
}: {
  events: DashboardEvent[];
  title?: string;
  showStatus?: boolean;
  /** Where the card's "View All" link navigates. */
  viewAllHref?: string;
}) {
  return (
    <DashboardCard>
      <DashboardCardHeader title={title} actionHref={viewAllHref} />
      <div className="px-4">
        {events.map((event, index) => (
          <div
            className="flex items-center gap-3 border-b border-border py-3 last:border-0"
            key={`${event.title}-${index}`}
          >
            <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md bg-muted text-primary">
              {event.image ? (
                <img
                  className="size-full rounded-md object-cover"
                  src={event.image}
                  alt=""
                />
              ) : (
                <CalendarDays size={20} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-sm">{event.title}</strong>
              <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays size={13} />
                {event.date}
                <span aria-hidden>·</span>
                <Clock size={13} />
                <span className="truncate">{event.venue}</span>
              </span>
            </div>
            {showStatus && event.status && (
              <em
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] not-italic ${dashboardStatusClass(event.status)}`}
              >
                {event.status}
              </em>
            )}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
