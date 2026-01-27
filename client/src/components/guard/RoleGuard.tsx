import { UserRole } from "@/lib/types/common.types" 

interface Props {
  allowed: UserRole[]
  role: UserRole
  children: React.ReactNode
}

export function RoleGuard({ allowed, role, children }: Props) {
  if (!allowed.includes(role)) return null
  return <>{children}</>
}
