// components/UserDropdown.tsx
"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/store/slices/authSlice"; // adjust to your slice

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  CircleUser,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hook";

export default function UserDropdown() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Optional: get user from redux / context / auth provider
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name?: string) =>
    name
      ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
      : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          aria-label="User menu"
        >
          {user?.avtar ? (
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user?.avtar}
                alt={user.fullName || "User"}
              />
              <AvatarFallback>
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <CircleUser className="h-8 w-8 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.fullName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "logged in"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => router.push("/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => router.push("/my-events")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>

          {/* <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => router.push("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600"
          onSelect={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
