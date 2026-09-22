"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearAuth } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hook";

const AUTH_SEGMENTS = ["/login", "/register", "/forgot-password"];

/**
 * Global handler for the `auth:expired` window event dispatched by the axios
 * layer when the API rejects the session (401). Clears the Redux auth state
 * (and therefore redux-persist) and soft-navigates to /login.
 *
 * Mounted once from PublicPageShell so it is active on every page.
 */
export default function AuthSessionHandler() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleExpired = () => {
      dispatch(clearAuth());
      toast.error("Your session has expired. Please sign in again.");
      const path = window.location.pathname;
      const onAuthPage = AUTH_SEGMENTS.some(
        (segment) => path === segment || path.startsWith(`${segment}/`),
      );
      if (!onAuthPage) {
        router.replace(
          `/login?redirect=${encodeURIComponent(path + window.location.search)}`,
        );
      }
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [dispatch, router]);

  return null;
}
