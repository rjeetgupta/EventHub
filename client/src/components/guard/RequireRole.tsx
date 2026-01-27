import { redirect } from "next/navigation"
import { UserRole } from "@/lib/types/common.types" 

export function requireRole(
  userRole: UserRole,
  allowed: UserRole[]
) {
  if (!allowed.includes(userRole)) {
    redirect("/events")
  }
}
