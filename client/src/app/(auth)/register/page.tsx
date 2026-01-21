"use client"

import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RegisterRequest } from "@/lib/types/user.types";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { registerUser, clearError } from "@/store/slices/authSlice";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Cleanup error on unmount
  useEffect(() => {
    return () => {
      clearError()
    };
  }, [clearError]);

  const handleRegister = async (data: RegisterRequest) => {
    clearError();
    try {
      const result = dispatch(registerUser(data));
      if (registerUser.fulfilled.match(result)) {
        toast.success("Registration successful")
        router.replace("/login")
      }
    } catch {
      // error handled in store
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Card className="w-full max-w-112.5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription>
            Join the EvenHub community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
          />
        </CardContent>
        <CardFooter className="justify-center border-t">
          <p className="text-sm text-muted-foreground">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
