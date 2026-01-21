"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { LoginForm } from "@/components/forms/LoginForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { LoginRequest } from "@/lib/types/user.types";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { loginUser, setAuthError, clearError } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { UserRole } from "@/lib/types/common.types";

export default function LoginPage() {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const { isLoading, error, isAuthenticated, } = useAppSelector((state) => state.auth)

    // Redirect when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/events");
        }
    }, [isAuthenticated, router]);

    // Cleanup error on unmount
    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    /**
     * Routes mapping for redirections
     */
    const roleRedirectMap: Record<UserRole, string> = {
        [UserRole.SUPER_ADMIN]: "/admin",
        [UserRole.DEPARTMENT_ADMIN]: "/department",
        [UserRole.GROUP_ADMIN]: "/group-admin",
        [UserRole.STUDENT]: "/my-events"
    }
      
    const handleLogin = async (data: LoginRequest) => {
        clearError()
        try {
            const result = await dispatch(loginUser(data))
            if (loginUser.fulfilled.match(result)) {
                toast.success("Login successful")
                router.push(roleRedirectMap[result.payload.user.role])
                console.log("AFTER LOGGIN : ", result.payload.user.role)
            } else {
                toast.error("Login failed");
            }
        } catch {
            // error handled in store
        }
    };

    return (
        <div className="flex min-h-[85vh] items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        EventHub Login
                    </CardTitle>
                    <CardDescription>
                        Enter your details to access campus events
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <LoginForm
                        onSubmit={handleLogin}
                        isLoading={isLoading}
                    />
                </CardContent>

                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
