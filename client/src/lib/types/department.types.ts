/**
 * ============================================================================
 * FRONTEND : DEPARTMENT TYPES (BACKEND ALIGNED)
 * ============================================================================
 */

/* -------------------- ADMIN -------------------- */

export interface DepartmentAdminInfo {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

/* -------------------- STATS -------------------- */

export interface DepartmentStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalParticipants: number;
  totalGroupAdmins: number;
  averageAttendance: number;
}

/* -------------------- DEPARTMENT -------------------- */

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;

  // Only visible to SUPER_ADMIN / internal users
  admin?: DepartmentAdminInfo;

  // Optional because backend marks it optional
  stats?: DepartmentStats;

  createdAt: string;
  updatedAt: string;
}

/* -------------------- REQUESTS -------------------- */

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
  adminEmail: string;
  adminPassword: string;
  adminFullName: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  code?: string;
  description?: string;
}

/* -------------------- RESPONSES -------------------- */

export interface CreateDepartmentResponse {
  department: {
    id: string;
    name: string;
    code: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
  departmentAdmin: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface PaginatedDepartmentsResponse {
  data: Department[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* -------------------- REDUX STATE -------------------- */

export interface DepartmentState {
  departments: Department[];
  currentDepartment: Department | null;

  departmentsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  isLoading: boolean;
  isCreatingDepartment: boolean;
  isUpdatingDepartment: boolean;
  isDeletingDepartment: boolean;

  error: string | null;
}