import { Sidebar } from "@/components/common/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* <Sidebar /> */}

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className=" p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
