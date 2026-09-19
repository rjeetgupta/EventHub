import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const columnClasses = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 md:grid-cols-2",
  "3": "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  "4": "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
  "5": "grid-cols-1 md:grid-cols-2 xl:grid-cols-5",
} as const;

export function DashboardSection({
  children,
  columns = "1",
  className,
}: {
  children: ReactNode;
  columns?: keyof typeof columnClasses;
  className?: string;
}) {
  return (
    <div className={cn("mt-4 grid gap-4", columnClasses[columns], className)}>
      {children}
    </div>
  );
}
