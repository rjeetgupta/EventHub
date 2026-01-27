import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { ApiResponse } from '@/lib/types/common.types';

// CONFIGURATION

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRY_ATTEMPTS = 3;

// AXIOS INSTANCE

/**
 * Main axios instance with default configuration
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Set to true if using HTTP-only cookies
});

// REQUEST INTERCEPTOR

/**
 * Intercepts outgoing requests to:
 * - Attach authorization tokens
 * - Add request metadata
 * - Log requests in development
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Attach access token from localStorage
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for tracking
    config.metadata = { startTime: new Date().getTime() };

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError): Promise<never> => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR

/**
 * Flag to prevent multiple simultaneous token refresh requests
 */
let isRefreshing = false;

/**
 * Queue to hold failed requests during token refresh
 */
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Intercepts responses to:
 * - Handle successful responses
 * - Manage token refresh on 401
 * - Handle errors consistently
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Calculate request duration
    const duration = response.config.metadata?.startTime
      ? new Date().getTime() - response.config.metadata.startTime
      : 0;

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        duration: `${duration}ms`,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<ApiResponse>): Promise<never | AxiosResponse> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // HANDLE 401 UNAUTHORIZED - TOKEN REFRESH
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Check if we have a refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        handleAuthError();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        const response = await axios.post<ApiResponse<{
          accessToken: string;
          refreshToken: string;
        }>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data!;

        // Update tokens in storage
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Process queued requests
        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Token refresh failed
        processQueue(refreshError as Error, null);
        isRefreshing = false;
        handleAuthError();
        return Promise.reject(refreshError);
      }
    }

    // HANDLE NETWORK ERRORS WITH RETRY
    if (
      !error.response &&
      originalRequest &&
      (!originalRequest._retryCount || originalRequest._retryCount < MAX_RETRY_ATTEMPTS)
    ) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      console.warn(
        `🔄 Retrying request (${originalRequest._retryCount}/${MAX_RETRY_ATTEMPTS}):`,
        originalRequest.url
      );

      // Exponential backoff
      const delay = Math.pow(2, originalRequest._retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      return axiosInstance(originalRequest);
    }

    // REJECT WITH FORMATTED ERROR
    return Promise.reject(error);
  }
);

// HELPER FUNCTIONS

/**
 * Handles authentication errors by clearing tokens and redirecting
 */
const handleAuthError = (): void => {
  console.warn('🔒 Authentication failed - clearing session');
  
  localStorage.removeItem('accessToken');

  // Redirect to login (only in browser)
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    
    // Don't redirect if already on auth pages
    if (!['/login', '/register', '/forgot-password'].includes(currentPath)) {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
  }
};

/**
 * Standardized error handler for API calls
 * 
 * @param error - The error object from axios or try-catch
 * @returns User-friendly error message
 */
export const handleApiError = (error: unknown): string => {
  // Handle axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    // Server returned an error response
    if (axiosError.response?.data) {
      const { message, error: errorMessage } = axiosError.response.data;
      // const { message, error: errorMessage } = axiosError?.response?.data?.errors[0];
      return message || errorMessage || 'An error occurred';
    }

    // Network or timeout errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection and try again.';
    }

    if (axiosError.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.';
    }

    // Status-based error messages
    const status = axiosError.response?.status;
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access forbidden. You don\'t have permission.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict. Resource already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Bad gateway. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      case 504:
        return 'Gateway timeout. Please try again later.';
      default:
        return axiosError.message || 'An unexpected error occurred.';
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle unknown error types
  return 'An unexpected error occurred.';
};

/**
 * Creates a formatted ApiError object
 * 
 * @param error - The error object
 * @returns Formatted ApiError
 */
export const formatApiError = (error: unknown): any => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    
    return {
      message: handleApiError(error),
      statusCode: axiosError.response?.status || 500,
      errors: axiosError.response?.data?.error
        ? { general: [axiosError.response.data.error] }
        : undefined,
    };
  }

  return {
    message: handleApiError(error),
    statusCode: 500,
  };
};

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
    _retry?: boolean;
    _retryCount?: number;
  }
}

export default axiosInstance;