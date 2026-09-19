import { cn } from "@/lib/utils";

export function DashboardSystemOverview({
  active = 0,
  draft = 0,
  completed = 0,
  users = "—",
}: {
  active?: number;
  draft?: number;
  completed?: number;
  users?: string | number;
}) {
  const rows = [
    { label: "Active Events", value: active, dot: "bg-success" },
    { label: "Draft Events", value: draft, dot: "bg-warning" },
    { label: "Completed Events", value: completed, dot: "bg-primary" },
    { label: "Total Users", value: users, dot: "bg-muted-foreground" },
  ] as const;

  return (
    <div className="px-4 pb-3">
      {rows.map((row) => (
        <p
          className="flex items-center gap-2 border-b border-border py-3 text-xs last:border-0"
          key={row.label}
        >
          <i className={cn("size-2.5 rounded-full", row.dot)} />
          {row.label}
          <b className="ml-auto">{row.value}</b>
        </p>
      ))}
    </div>
  );
}
