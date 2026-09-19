import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DashboardCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function DashboardCardHeader({
  title,
  action = "View All",
  onAction,
  actionHref,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  /** When set, the action renders as a link (no onAction needed). */
  actionHref?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <h2 className="text-base font-semibold">{title}</h2>
      {action && (actionHref || onAction) && (
        <Link
          href={actionHref ?? "#"}
          onClick={onAction ? (event) => {
            event.preventDefault();
            onAction();
          } : undefined}
          className="inline-flex min-w-max items-center gap-1 whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          {action}
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
