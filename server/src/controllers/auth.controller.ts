import { prisma } from "../config/db";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
  changePasswordSchema,
  updateProfileSchema
} from "../validators/auth.validator.js";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  changePassword,
  updateProfile,
  getProfile
} from "../services/auth.service";

// Options
const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export const accessTokenCookieOptions = {
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000,
};

export const refreshTokenCookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};


const register = asyncHandler(async (req, res) => {
  console.log("REGISTER DATA ", req.body)
  const data = registerSchema.parse(req.body);
  const user = await registerUser(data);
  res.status(201).json(
    new ApiResponse(
      201,
      user,
      "Registration successful"
    ));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  console.log("LOGGED IN DATA : ", email, password);
  const result = await loginUser(email, password);

  res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);

  res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);

  res.status(200).json(
    new ApiResponse(
      200,
      { user: result.user },
      "Login successful"
    ));
});


const refreshToken = asyncHandler(async(req, res) => {
  const token = req.cookies?.refreshToken;

  const accessToken = await refreshAccessToken(token);

  res.cookie("accessToken", accessToken, refreshTokenCookieOptions);

  res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Token refreshed"
    ));
});


const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Logged out successfully"
    ));
});

const changeUserPassword = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Authentication required");
  }

  const data = changePasswordSchema.parse(req.body);
  const result = await changePassword(req.user.id, data);

  res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Password changed successfully"
    ));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Authentication required");
  }

  const data = updateProfileSchema.parse(req.body);
  const user = await updateProfile(req.user.id, data);

  res.status(200).json(
    new ApiResponse(
      200,
      user,
      "Profile updated successfully"
    ));
});

const getProfileDetails = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const user = await getProfile(userId);

  res.status(200).json(
    new ApiResponse(
      200,
      user,
      "Profile fetched successfully"
    )
  );
});


export {
  register,
  login,
  refreshToken,
  logout,
  changeUserPassword,
  updateUserProfile,
  getProfileDetails
}