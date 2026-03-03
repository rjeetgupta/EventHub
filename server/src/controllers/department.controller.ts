import { Request, Response } from "express";
import departmentService from "../services/department.service";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";


export const getDepartments = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    // const userRole = user?.role?.name ?? RoleType.PUBLIC;
    const userRole = user?.role
    const userDepartmentId = user?.departmentId;
    
    const result = await departmentService.getDepartments(
      req.validated.query,
      userRole,
      userDepartmentId
    );

    res.status(200).json(
      new ApiResponse(200, result, "Departments fetched successfully")
    );
  }
);


export const getDepartmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const department = await departmentService.getDepartmentById(
      req.params.id
    );

    res.status(200).json(
      new ApiResponse(200, department, "Department fetched successfully")
    );
  }
);


export const createDepartment = asyncHandler(
  async (req: Request, res: Response) => {

    const result =
      await departmentService.createDepartment(
        req.validated.body
      );

    res.status(201).json(
      new ApiResponse(
        201,
        {
          department: {
            id: result.department.id,
            name: result.department.name,
            code: result.department.code,
            description: result.department.description,
            createdAt: result.department.createdAt,
          },
          departmentAdmin: {
            id: result.departmentAdmin.id,
            email: result.departmentAdmin.email,
            fullName: result.departmentAdmin.fullName,
          },
        },
        "Department and credentials created successfully"
      )
    );
  }
);


export const updateDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    const department = await departmentService.updateDepartment(
      req.validated.params.id,
      req.validated.body,
      req.user!.id,
      req.user!.role
    );

    res.status(200).json(
      new ApiResponse(200, department, "Department updated successfully")
    );
  }
);

export const deleteDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    await departmentService.deleteDepartment(req.validated.params.id);

    res.status(200).json(
      new ApiResponse(200, null, "Department deleted successfully")
    );
  }
);

// ============================================================================
// GROUP ADMIN CONTROLLERS
// ============================================================================

export const getGroupAdmins = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await departmentService.getGroupAdmins(
      req.validated.params.id,
      req.validated.query
    );

    res.status(200).json(
      new ApiResponse(200, result, "Group admins fetched successfully")
    );
  }
);

export const assignGroupAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const groupAdmin = await departmentService.assignGroupAdmin(
      req.validated.params.id,
      req.validated.body,
      req.user!.id
    );

    res.status(201).json(
      new ApiResponse(201, groupAdmin, "Group admin assigned successfully")
    );
  }
);

export const updateGroupAdminPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const groupAdmin = await departmentService.updateGroupAdminPermissions(
      req.validated.params.departmentId,
      req.validated.params.groupAdminId,
      req.validated.body
    );

    res.status(200).json(
      new ApiResponse(200, groupAdmin, "Permissions updated successfully")
    );
  }
);

export const removeGroupAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    await departmentService.removeGroupAdmin(
      req.validated.params.departmentId,
      req.validated.params.groupAdminId
    );

    res.status(200).json(
      new ApiResponse(200, null, "Group admin removed successfully")
    );
  }
);

// ============================================================================
// PERMISSION CONTROLLERS
// ============================================================================

export const getAvailablePermissions = asyncHandler(
  async (_req: Request, res: Response) => {
    const permissions = await departmentService.getAvailablePermissions();

    res.status(200).json(
      new ApiResponse(200, permissions, "Permissions fetched successfully")
    );
  }
);

// ============================================================================
// ANALYTICS CONTROLLERS
// ============================================================================

export const getDepartmentAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await departmentService.getDepartmentAnalytics(
      req.validated.params.id,
      req.validated.query
    );

    res.status(200).json(
      new ApiResponse(200, analytics, "Analytics fetched successfully")
    );
  }
);