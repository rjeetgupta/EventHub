import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { UserRole } from "../types/common.types.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from "../utils/jwt.js";

export const registerUser = async (data: {
  fullName: string;
  email: string;
  password: string;
  departmentId: string;
  studentID: string;
}) => {
  const exists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (exists) {
    throw new ApiError(400, "Email already registered");
  }

  const studentRole = await prisma.role.findUnique({
    where: { name: UserRole.STUDENT },
  });

  if (!studentRole) {
    throw new ApiError(500, "Student role missing");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      studentID: data.studentID,
      password: hashedPassword,
      roleId: studentRole.id,
      departmentId: data.departmentId,
      isActive: true,
    },
    include: { role: true },
  });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    studentID: user.studentID,
    role: user.role.name,
    departmentId: user.departmentId,
  };
};


export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role.name,
    departmentId: user.departmentId,
  });

  const refreshToken = generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      studentID: user.studentID,
      email: user.email,
      role: user.role.name,
      departmentId: user.departmentId,
    },
  };
};


export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: { include: { role: true } } },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const accessToken = generateAccessToken({
    userId: stored.user.id,
    role: stored.user.role.name,
    departmentId: stored.user.departmentId,
  });

  return accessToken;
};


export const changePassword = async (
  userId: string,
  data: {
    currentPassword: string;
    newPassword: string;
  }
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(data.currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return { message: "Password changed successfully" };
};

export const updateProfile = async (
  userId: string,
  data: {
    fullName?: string;
    avatar?: string;
  }
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.avatar && { avatar: data.avatar }),
    },
    include: { role: true },
  });

  return {
    id: updatedUser.id,
    fullName: updatedUser.fullName,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    studentID: updatedUser.studentID,
    role: updatedUser.role.name,
    departmentId: updatedUser.departmentId,
    createdAt: updatedUser.createdAt,
  };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    studentID: user.studentID,
    role: user.role.name,
    departmentId: user.departmentId,
    createdAt: user.createdAt,
  };
};
