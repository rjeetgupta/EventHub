import { Event } from "@/lib/types/event.types" 
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ApprovalRow({ event }: { event: Event }) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="font-medium">{event.title}</p>
          <p className="text-sm text-muted-foreground">
            Created by {event.departmentName
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            {event.status}
          </Badge>

          <Button variant="secondary" size="sm">
            Reject
          </Button>
          <Button size="sm">
            Approve
          </Button>
        </div>
      </div>
    </div>
  )
}
