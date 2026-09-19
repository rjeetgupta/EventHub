import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardCard } from "./DashboardCard";

export function DashboardStat({
  icon: Icon,
  value,
  label,
  trend = "+12%",
  className,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
  className?: string;
}) {
  return (
    <DashboardCard
      className={cn("relative flex items-center gap-3.5 p-3.5", className)}
    >
      <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
        <Icon size={25} />
      </span>
      <div className="min-w-0">
        <strong className="block text-2xl">{value}</strong>
        <span className="block truncate text-[13px] text-muted-foreground">
          {label}
        </span>
        <small
          className={cn(
            "mt-1.5 block text-xs",
            trend.startsWith("↓") ? "text-destructive" : "text-success",
          )}
        >
          {trend}
        </small>
      </div>
      <ChevronRight className="ml-auto shrink-0 text-muted-foreground" size={18} />
    </DashboardCard>
  );
}
