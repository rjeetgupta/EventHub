import axiosInstance, { handleApiError } from "@/api/axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "@/lib/types/user.types";
import type { ApiResponse } from "@/lib/types/common.types";

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * Register a new user account
 * 
 * @param data - User registration data
 * @returns Auth response with user and tokens
 * @throws Error with user-friendly message
 * 
 * @example
 * ```ts
 * const response = await authApi.register({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'securePass123',
 *   studentId: 'STU001',
 *   department: 'btech'
 * });
 * ```
 */
export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Registration failed');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Authenticate user with email and password
 * 
 * @param data - Login credentials
 * @returns Auth response with user and tokens
 * @throws Error with user-friendly message
 * 
 * @example
 * ```ts
 * const response = await authApi.login({
 *   email: 'john@example.com',
 *   password: 'securePass123'
 * });
 * ```
 */
export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Login failed');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Logout current user
 * 
 * Clears tokens on backend and frontend.
 * Always succeeds on frontend even if API call fails.
 * 
 * @throws Never throws - always clears session
 * 
 * @example
 * ```ts
 * await authApi.logout();
 * // User is now logged out regardless of API response
 * ```
 */
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    // Log warning but don't throw - logout should always succeed
    console.warn('⚠️ Logout API call failed:', handleApiError(error));
  } finally {
    // Always clear tokens on frontend
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

/**
 * Refresh access token using refresh token
 * 
 * Note: This is typically called automatically by axios interceptor.
 * Manual calls should be rare.
 * 
 * @throws Error if refresh fails (requires re-authentication)
 * 
 * @example
 * ```ts
 * try {
 *   await authApi.refreshAccessToken();
 * } catch (error) {
 *   // Redirect to login
 * }
 * ```
 */
export const refreshAccessToken = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axiosInstance.post<ApiResponse<{
      accessToken: string;
      refreshToken?: string;
    }>>(
      '/auth/refresh',
      { refreshToken }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Token refresh failed');
    }

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
  } catch (error) {
    // Clear invalid tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// USER PROFILE ENDPOINTS
// ============================================================================

/**
 * Get currently authenticated user's profile
 * 
 * @returns User object
 * @throws Error if not authenticated or fetch fails
 * 
 * @example
 * ```ts
 * const user = await authApi.getCurrentUser();
 * console.log(user.name, user.role);
 * ```
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch user profile');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update authenticated user's profile
 * 
 * @param data - Partial user data to update
 * @returns Updated user object
 * @throws Error if update fails
 * 
 * @example
 * ```ts
 * const updatedUser = await authApi.updateProfile({
 *   name: 'John Smith',
 *   avatar: 'https://example.com/avatar.jpg'
 * });
 * ```
 */
export const updateProfile = async (
  data: Partial<User>
): Promise<User> => {
  try {
    const response = await axiosInstance.put<ApiResponse<User>>(
      '/auth/profile',
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update profile');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// PASSWORD MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * Change user's password (requires current password)
 * 
 * @param data - Current and new password
 * @throws Error if current password is incorrect or change fails
 * 
 * @example
 * ```ts
 * await authApi.changePassword({
 *   currentPassword: 'oldPass123',
 *   newPassword: 'newSecurePass456'
 * });
 * ```
 */
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      '/auth/change-password',
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to change password');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Request password reset email
 * 
 * Sends reset link to user's email if account exists.
 * Always returns success for security (no user enumeration).
 * 
 * @param email - User's email address
 * @throws Error only on network/server errors
 * 
 * @example
 * ```ts
 * await authApi.forgotPassword('john@example.com');
 * // Check your email for reset link
 * ```
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      '/auth/forgot-password',
      { email }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send reset email');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Reset password using token from email
 * 
 * @param data - Reset token and new password
 * @throws Error if token is invalid/expired or reset fails
 * 
 * @example
 * ```ts
 * await authApi.resetPassword({
 *   token: 'abc123token',
 *   password: 'newSecurePass456'
 * });
 * ```
 */
export const resetPassword = async (data: {
  token: string;
  password: string;
}): Promise<void> => {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      '/auth/reset-password',
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to reset password');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// EMAIL VERIFICATION ENDPOINTS
// ============================================================================

/**
 * Verify user's email address using token
 * 
 * @param token - Verification token from email
 * @throws Error if token is invalid/expired
 * 
 * @example
 * ```ts
 * await authApi.verifyEmail('verification-token-123');
 * // Email verified successfully
 * ```
 */
export const verifyEmail = async (token: string): Promise<void> => {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      '/auth/verify-email',
      { token }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to verify email');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Request new verification email
 * 
 * @throws Error if request fails
 * 
 * @example
 * ```ts
 * await authApi.resendVerificationEmail();
 * // Check your email for new verification link
 * ```
 */
export const resendVerificationEmail = async (): Promise<void> => {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      '/auth/resend-verification'
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to resend verification email');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};


export const authApi = {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};