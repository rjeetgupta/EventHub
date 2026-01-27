import { PERMISSIONS } from "@/lib/permissions"
import { UserRole } from "@/lib/types/common.types" 

interface Props {
  permission: keyof typeof PERMISSIONS
  role: UserRole
  children: React.ReactNode
}

export function PermissionGuard({
  permission,
  role,
  children,
}: Props) {
  if (!PERMISSIONS[permission].includes(role)) {
    return null
  }
  return <>{children}</>
}
