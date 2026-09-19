import { dashboardChartColors, dashboardChartLabels } from "@/constant/dashboard";
import { cn } from "@/lib/utils";


function buildDonutGradient(segments: number[]): string {
  const total = segments.reduce((sum, value) => sum + value, 0) || 1;
  const stops: string[] = [];
  let cursor = 0;
  segments.forEach((value, index) => {
    const start = (cursor / total) * 100;
    cursor += value;
    const end = (cursor / total) * 100;
    stops.push(
      `var(--color-${dashboardChartColors[index % dashboardChartColors.length]}) ${start}% ${end}%`,
    );
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export function DashboardDonut({
  value = 48,
  label = "Events",
  segments = [40, 25, 18, 10, 7],
  labels = [...dashboardChartLabels],
  className,
}: {
  value?: string | number;
  label?: string;
  segments?: number[];
  labels?: readonly string[];
  className?: string;
}) {
  const visible = labels
    .map((name, index) => ({ name, value: segments[index] ?? 0, color: dashboardChartColors[index % dashboardChartColors.length] }))
    .filter((segment) => segment.value > 0);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-6 px-4 py-7",
        className,
      )}
    >
      <div
        className="grid size-36 shrink-0 place-items-center rounded-full"
        style={{ background: buildDonutGradient(segments) }}
      >
        <div className="grid size-22 place-content-center rounded-full bg-card text-center">
          <strong className="text-xl">{value}</strong>
          <small className="text-[11px] text-muted-foreground">{label}</small>
        </div>
      </div>
      <div className="grid gap-2.5 text-xs text-muted-foreground">
        {visible.map((segment) => (
          <span
            className="grid grid-cols-[10px_1fr_28px] items-center gap-2"
            key={segment.name}
          >
            <i
              className="size-2.5 rounded-sm"
              style={{ background: `var(--color-${segment.color})` }}
            />
            {segment.name}
            <b className="text-right text-foreground">{segment.value}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
