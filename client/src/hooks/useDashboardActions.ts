"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { dashboardActionRoutes } from "@/constant/dashboard";

/**
 * Handles `dashboard-action` CustomEvents dispatched by quick-action buttons.
 * Registers per role so each dashboard only responds to its own routes.
 */
export function useDashboardActions(role: "admin" | "department" | "group" | "student") {
  const router = useRouter();

  useEffect(() => {
    const handler = (event: Event) => {
      const label = (event as CustomEvent<string>).detail;
      const route = dashboardActionRoutes[role]?.[label];
      if (route) router.push(route);
    };
    window.addEventListener("dashboard-action", handler);
    return () => window.removeEventListener("dashboard-action", handler);
  }, [role, router]);
}

/** Convenience click handler for quick-action buttons rendered inline. */
export function useDashboardActionClick() {
  return useCallback((label: string) => {
    window.dispatchEvent(new CustomEvent("dashboard-action", { detail: label }));
  }, []);
}
