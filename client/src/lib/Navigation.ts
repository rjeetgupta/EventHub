import { UserRole } from "./types/common.types";

export interface NavItem {
  label: string
  href: string
  roles?: UserRole[]
}



/**
 * Public (marketing) navigation. Shown only to logged-out visitors — once a
 * user is authenticated the DashboardShell sidebar takes over navigation, so
 * role-specific links belong in `constant/dashboardNavigation`, not here.
 */
export const NAVIGATION: NavItem[] = [
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
];

