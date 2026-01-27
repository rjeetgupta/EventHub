export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string; // ISO string
  }
  
  export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
}
  
export type Role =
  | "PUBLIC"
  | "STUDENT"
  | "GROUP_ADMIN"
  | "DEPARTMENT_ADMIN"
  | "ADMIN";

  
  /**
   * Frontend-friendly enums
   */
  export enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    DEPARTMENT_ADMIN = "DEPARTMENT_ADMIN",
    GROUP_ADMIN = "GROUP_ADMIN",
    STUDENT = "STUDENT",
  }
  
  export enum Permission {
    CREATE_EVENT = "CREATE_EVENT",
    UPDATE_EVENT = "UPDATE_EVENT",
    DELETE_EVENT = "DELETE_EVENT",
    PUBLISH_EVENT = "PUBLISH_EVENT",
    CLOSE_EVENT = "CLOSE_EVENT",
    MARK_ATTENDANCE = "MARK_ATTENDANCE",
    DECLARE_WINNERS = "DECLARE_WINNERS",
    MANAGE_GROUP_ADMINS = "MANAGE_GROUP_ADMINS",
    ASSIGN_PERMISSIONS = "ASSIGN_PERMISSIONS",
    VIEW_REGISTRATIONS = "VIEW_REGISTRATIONS",
  }
  
  export interface RolePermission {
    role: UserRole;
    permissions: Permission[];
  }
  
  export enum EventStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    PUBLISHED = "PUBLISHED",
    REGISTRATION_CLOSED = "REGISTRATION_CLOSED",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED",
  }
  
  export enum RegistrationStatus {
    REGISTERED = "REGISTERED",
    CANCELLED = "CANCELLED",
    ATTENDED = "ATTENDED",
    ABSENT = "ABSENT",
  }
  