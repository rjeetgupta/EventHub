import { cn } from "@/lib/utils";

export type DashboardChartType = "line" | "bar";

export function DashboardChart({
  values = [28, 42, 34, 55, 47, 69, 61],
  labels = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  type = "line",
  className,
}: {
  values?: number[];
  labels?: string[];
  type?: DashboardChartType;
  className?: string;
}) {
  const max = Math.max(...values, 1);
  return (
    <div className={cn("space-y-3 p-4", className)}>
      <div className="flex h-44 items-end gap-3 border-b border-border">
        {values.map((value, index) => (
          <span
            key={index}
            className={cn(
              "flex-1 rounded-t-md",
              type === "line"
                ? "bg-gradient-to-t from-primary/30 to-transparent"
                : "bg-primary/70",
            )}
            style={{ height: `${Math.max(8, (value / max) * 88)}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between pt-1 text-[10px] text-muted-foreground">
        {labels.map((label) => (
          <small key={label}>{label}</small>
        ))}
      </div>
    </div>
  );
}
