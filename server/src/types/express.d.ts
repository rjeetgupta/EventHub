import { RoleType } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        fullName: string;
        role: {
          id: string;
          name: RoleType;
        };
        departmentId?: string;
      };
      validated?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

export {};