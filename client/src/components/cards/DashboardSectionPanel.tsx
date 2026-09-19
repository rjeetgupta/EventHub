import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DashboardCard, DashboardCardHeader } from "@/components/cards/DashboardCard";

/**
 * Standard panel for role section pages: titled card + content area.
 * Pass `toolbar` to render a heading/CTA row above the content.
 */
export function DashboardSectionPanel({
  title,
  subtitle,
  toolbar,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DashboardCard className={cn("mt-4 overflow-hidden", className)}>
      <DashboardCardHeader title={title} action="" />
      {subtitle && (
        <p className="px-4 pt-3 text-xs text-muted-foreground">{subtitle}</p>
      )}
      <div className="p-5.5">
        {toolbar && <div className="mb-4">{toolbar}</div>}
        {children}
      </div>
    </DashboardCard>
  );
}
