import { authApi } from '@/api/auth.api';
import { RegisterRequest } from '@/lib/types/user.types';
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from '@/lib/validators/auth.validators';
import { ZodError } from 'zod';

// ============ AUTH SERVICE ============

export class AuthService {
  /**
   * Login user with validation
   */
  static async login(credentials: LoginInput) {
    try {
      // Validate input
      const validatedData = loginSchema.parse(credentials);

      // Call API
      const response = await authApi.login(validatedData);

      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Register new user with validation
   */
  static async register(data: RegisterInput) {
    try {
      const validatedData = registerSchema.parse(data);
      const response = await authApi.register(validatedData);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  static async logout() {
    try {
      await authApi.logout();

      localStorage.removeItem('accessToken');

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      // Clear tokens even if API fails
      localStorage.removeItem('accessToken');
      return this.handleError(error);
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const user = await authApi.getCurrentUser();
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update user profile with validation
   */
  static async updateProfile(data: UpdateProfileInput) {
    try {
      const validatedData = updateProfileSchema.parse(data);
      const user = await authApi.updateProfile(validatedData);

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Change password with validation
   */
  static async changePassword(data: ChangePasswordInput) {
    try {
      const validatedData = changePasswordSchema.parse(data);

      await authApi.changePassword({
        currentPassword: validatedData.currentPassword,
        newPassword: validatedData.newPassword,
      });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Request password reset with validation
   */
  static async forgotPassword(data: ForgotPasswordInput) {
    try {
      const validatedData = forgotPasswordSchema.parse(data);
      await authApi.forgotPassword(validatedData.email);

      return {
        success: true,
        message: 'Reset email sent successfully',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Reset password with validation
   */
  static async resetPassword(data: ResetPasswordInput) {
    try {
      const validatedData = resetPasswordSchema.parse(data);

      await authApi.resetPassword({
        token: validatedData.token,
        password: validatedData.password,
      });

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle errors with proper formatting
   */
  private static handleError(error: any) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path[0] as string;
        fieldErrors[path] = err.message;
      });

      return {
        success: false,
        errors: fieldErrors,
        message: 'Validation failed',
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}
