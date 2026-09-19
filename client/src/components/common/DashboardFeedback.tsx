"use client";

import { DashboardCard } from "@/components/cards/DashboardCard";

export function DashboardErrorState({
  title = "Unable to load dashboard data",
  message,
  onRetry,
}: {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
}) {
  return (
    <DashboardCard className="mt-4 p-7 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      {message && <p className="mt-1 text-sm text-muted-foreground">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex items-center rounded-md bg-primary px-4.5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Retry
        </button>
      )}
    </DashboardCard>
  );
}

export function DashboardEmpty({
  message = "Nothing to show here yet.",
}: {
  message?: string;
}) {
  return (
    <div className="grid min-h-28 place-items-center p-6 text-center text-xs text-muted-foreground">
      {message}
    </div>
  );
}

export function DashboardApiNote({ children = "API needed" }: { children?: string }) {
  return (
    <span className="mt-3 inline-block rounded-md bg-primary/10 px-2.5 py-1.5 text-xs text-primary">
      {children}
    </span>
  );
}
