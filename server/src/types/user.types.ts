import { RoleType } from "../../generated/prisma/enums";

export interface User {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  departmentId?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  role: RoleType;
  departmentId?: string | null;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: RoleType;
  departmentId?: string | null;
  iat?: number;
  exp?: number;
}
