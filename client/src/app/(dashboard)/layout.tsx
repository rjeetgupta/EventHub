import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell><DashboardOverview /></DashboardShell>
  )
}
