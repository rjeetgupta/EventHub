import bcrypt from "bcrypt";
import { prisma } from "../src/config/db.js";
import { RoleType, PermissionType } from "../generated/prisma/enums.js";

/**
 * Seeds all user roles into the database
 * Creates: SUPER_ADMIN, DEPARTMENT_ADMIN, GROUP_ADMIN, STUDENT
 */
async function seedRoles() {
  for (const role of Object.values(RoleType)) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }
}

/**
 * Seeds all permission types into the database
 * Creates 10 permission types for event management and admin tasks
 */
async function seedPermissions() {
  for (const permission of Object.values(PermissionType)) {
    await prisma.permission.upsert({
      where: { name: permission },
      update: {},
      create: {
        name: permission,
        description: permission.replace(/_/g, " "),
      },
    });
  }
}

/**
 * Seeds default departments into the database
 * Creates 4 departments: CS, EC, ME, CE
 */
async function seedDepartments() {
  const departments = [
    { name: "Computer Science", code: "CS" },
    { name: "Electronics", code: "EC" },
    { name: "Mechanical", code: "ME" },
    { name: "Civil", code: "CE" },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: {
        name: dept.name,
        code: dept.code,
        description: `${dept.name} Department`,
      },
    });
  }
}

/**
 * Assigns permissions to roles based on role hierarchy
 * - SUPER_ADMIN: All permissions
 * - DEPARTMENT_ADMIN: Admin & event management permissions
 * - GROUP_ADMIN: Event creation & management permissions
 * - STUDENT: Basic read permissions
 */
async function seedRolePermissions() {
  const roles = await prisma.role.findMany();
  const permissions = await prisma.permission.findMany();

  const rolePermissionMap: Record<RoleType, PermissionType[]> = {
    [RoleType.SUPER_ADMIN]: Object.values(PermissionType),
    [RoleType.DEPARTMENT_ADMIN]: [
      PermissionType.CREATE_EVENT,
      PermissionType.UPDATE_EVENT,
      PermissionType.DELETE_EVENT,
      PermissionType.PUBLISH_EVENT,
      PermissionType.CLOSE_EVENT,
      PermissionType.MANAGE_GROUP_ADMINS,
      PermissionType.ASSIGN_PERMISSIONS,
      PermissionType.VIEW_REGISTRATIONS,
    ],
    [RoleType.GROUP_ADMIN]: [
      PermissionType.CREATE_EVENT,
      PermissionType.UPDATE_EVENT,
      PermissionType.DELETE_EVENT,
      PermissionType.PUBLISH_EVENT,
    ],
    [RoleType.STUDENT]: [PermissionType.VIEW_REGISTRATIONS],
  };

  for (const role of roles) {
    const permissionNames = rolePermissionMap[role.name as RoleType] || [];

    for (const permName of permissionNames) {
      const permission = permissions.find((p) => p.name === permName);
      if (permission) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
          update: {},
          create: { roleId: role.id, permissionId: permission.id },
        });
      }
    }
  }
}

/**
 * Creates the Super Admin user from environment variables
 * Reads SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD from .env
 * Only creates if the admin doesn't already exist
 */
async function seedSuperAdmin() {
  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD missing in .env");
  }

  const superAdminRole = await prisma.role.findUnique({
    where: { name: RoleType.SUPER_ADMIN },
  });

  if (!superAdminRole) {
    throw new Error("SUPER_ADMIN role not found");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        fullName: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        roleId: superAdminRole.id,
        isActive: true,
      },
    });
  }
}

/**
 * Main seeding function
 * Executes all seeding functions in order:
 * 1. Roles
 * 2. Permissions
 * 3. Departments
 * 4. Role-Permission associations
 * 5. Super Admin user
 */
async function main() {
  await seedRoles();
  await seedPermissions();
  await seedDepartments();
  await seedRolePermissions();
  await seedSuperAdmin();
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
