import { UserRole } from "./types/common.types";

export interface NavItem {
  label: string
  href: string
  roles?: UserRole[]
}



export const NAVIGATION: NavItem[] = [
  // PUBLIC (Not Logged In)
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Explore Events",
    href: "/events",
  },
  {
    label: "About",
    href: "/about-us",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
  },

  // STUDENT + ALL AUTH
  {
    label: "Events",
    href: "/events",
    roles: [UserRole.STUDENT, UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    label: "My Events",
    href: "/my-events",
    roles: [UserRole.STUDENT, UserRole.GROUP_ADMIN,],
  },

  // GROUP ADMIN
  {
    label: "Create Event",
    href: "/events/create",
    roles: [UserRole.GROUP_ADMIN,],
  },
  {
    label: "My Department Events",
    href: "/department/events",
    roles: [UserRole.GROUP_ADMIN,],
  },

  // DEPARTMENT ADMIN
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: [UserRole.GROUP_ADMIN, UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    label: "Event Approvals",
    href: "/dashboard/approvals",
    roles: [UserRole.DEPARTMENT_ADMIN],
  },
  {
    label: "Group Admins",
    href: "/dashboard/group-admins",
    roles: [UserRole.DEPARTMENT_ADMIN],
  },

  // SYSTEM ADMIN
  {
    label: "Departments",
    href: "/dashboard/admin/departments",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    label: "System Analytics",
    href: "/dashboard/admin/analytics",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    label: "Settings",
    href: "/dashboard/admin/settings",
    roles: [UserRole.SUPER_ADMIN],
  },
];

