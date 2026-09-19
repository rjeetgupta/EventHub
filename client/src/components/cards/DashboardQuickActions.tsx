import type { LucideIcon } from "lucide-react";
import { DashboardCard, DashboardCardHeader } from "./DashboardCard";

export function DashboardQuickActions({
  actions,
  columns = 1,
}: {
  actions: { label: string; icon: LucideIcon }[];
  columns?: 1 | 2;
}) {
  return (
    <DashboardCard>
      <DashboardCardHeader title="Quick Actions" action="" />
      <div
        className={
          columns === 2
            ? "grid grid-cols-1 gap-2 p-3 sm:grid-cols-2"
            : "grid gap-2 p-4"
        }
      >
        {actions.map(({ label, icon: Icon }) => (
          <button
            className="flex items-center gap-2.5 rounded-md border border-primary px-3 py-2.5 text-left text-xs text-foreground transition-colors hover:bg-primary/10"
            key={label}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("dashboard-action", { detail: label }),
              )
            }
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>
    </DashboardCard>
  );
}
