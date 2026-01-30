import { UserRole } from "./common.types";

/**
 * User object returned by API
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  departmentId?: string | null;
  studentID?: string | null;
  isActive: boolean;
  emailVerified?: boolean;
  avtar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  studentID: string;
  email: string;
  password: string;
  departmentId: string;
  role?: UserRole;
}

/**
 * Minimal user for auth state (Redux)
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
/**
 * Redux Auth Slice State
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
