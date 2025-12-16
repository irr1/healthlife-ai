import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { saveTokens, clearTokens } from './cookies';

// Types for API responses
export interface ApiError {
  detail: string;
  status?: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string; // FastAPI OAuth2 expects 'username' field
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

// Configure base URL - use environment variable or default to localhost
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

        if (refreshToken) {
          // Attempt to refresh token
          const response = await axios.post<TokenResponse>(
            `${BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const { access_token, refresh_token } = response.data;

          // Save new tokens to both localStorage and cookies
          saveTokens(access_token, refresh_token);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const apiError: ApiError = {
      detail: error.response?.data?.detail || error.message || 'An error occurred',
      status: error.response?.status,
    };

    return Promise.reject(apiError);
  }
);

// API methods
export const api = {
  // Authentication
  auth: {
    register: async (data: RegisterRequest): Promise<TokenResponse> => {
      const response = await apiClient.post<TokenResponse>('/auth/register', data);

      // Save tokens to localStorage and cookies
      saveTokens(response.data.access_token, response.data.refresh_token);

      return response.data;
    },

    login: async (data: LoginRequest): Promise<TokenResponse> => {
      // Send JSON data with email instead of username
      const response = await apiClient.post<TokenResponse>('/auth/login', {
        email: data.username, // username field contains email
        password: data.password,
      });

      // Save tokens to localStorage and cookies
      saveTokens(response.data.access_token, response.data.refresh_token);

      return response.data;
    },

    logout: () => {
      clearTokens();
    },

    getCurrentUser: async (): Promise<UserResponse> => {
      const response = await apiClient.get<UserResponse>('/users/me');
      return response.data;
    },
  },

  // Users
  users: {
    getMe: async (): Promise<UserResponse> => {
      const response = await apiClient.get<UserResponse>('/users/me');
      return response.data;
    },

    updateMe: async (data: { full_name?: string; email?: string }): Promise<UserResponse> => {
      const response = await apiClient.put<UserResponse>('/users/me', data);
      return response.data;
    },
  },

  // Plans
  plans: {
    generate: async (preferences: any): Promise<any> => {
      const response = await apiClient.post('/plans/generate', { preferences });
      return response.data;
    },

    getActive: async (): Promise<any> => {
      const response = await apiClient.get('/plans/active');
      return response.data;
    },

    getById: async (id: number): Promise<any> => {
      const response = await apiClient.get(`/plans/${id}`);
      return response.data;
    },

    getAll: async (): Promise<any[]> => {
      const response = await apiClient.get('/plans/');
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/plans/${id}`);
    },
  },

  // Tasks
  tasks: {
    getToday: async (): Promise<any[]> => {
      const response = await apiClient.get('/tasks/today');
      return response.data;
    },

    getUpcoming: async (days: number = 7): Promise<any[]> => {
      const response = await apiClient.get(`/tasks/upcoming?days=${days}`);
      return response.data;
    },

    getById: async (id: number): Promise<any> => {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data;
    },

    complete: async (id: number, notes?: string): Promise<any> => {
      const response = await apiClient.post(`/tasks/${id}/complete`, { notes });
      return response.data;
    },

    skip: async (id: number, reason?: string): Promise<any> => {
      const response = await apiClient.post(`/tasks/${id}/skip`, { reason });
      return response.data;
    },

    reschedule: async (id: number, newDate: string): Promise<any> => {
      const response = await apiClient.post(`/tasks/${id}/reschedule`, { new_date: newDate });
      return response.data;
    },
  },

  // Journey
  journey: {
    getRoadmap: async (): Promise<any> => {
      const response = await apiClient.get('/journey/roadmap');
      return response.data;
    },

    getMilestones: async (): Promise<any[]> => {
      const response = await apiClient.get('/journey/milestones');
      return response.data;
    },

    getProgress: async (): Promise<any> => {
      const response = await apiClient.get('/journey/progress');
      return response.data;
    },

    submitWeeklyReview: async (review: any): Promise<any> => {
      const response = await apiClient.post('/journey/weekly-review', review);
      return response.data;
    },
  },

  // Coach
  coach: {
    chat: async (message: string, context?: string): Promise<any> => {
      const response = await apiClient.post('/coach/chat', { message, context });
      return response.data;
    },

    getDailyInsight: async (): Promise<any> => {
      const response = await apiClient.get('/coach/insight');
      return response.data;
    },

    searchKnowledge: async (query: string, category?: string, limit: number = 5): Promise<any[]> => {
      const params = new URLSearchParams({ query, limit: limit.toString() });
      if (category) params.append('category', category);

      const response = await apiClient.get(`/coach/knowledge?${params.toString()}`);
      return response.data;
    },

    adjustPlan: async (reason: string, changes: string[], priority: string = 'medium'): Promise<any> => {
      const response = await apiClient.post('/coach/adjust-plan', { reason, changes, priority });
      return response.data;
    },
  },

  // Analytics
  analytics: {
    getBodyBattery: async (days: number = 7): Promise<any> => {
      const response = await apiClient.get(`/analytics/body-battery?days=${days}`);
      return response.data;
    },

    getHabits: async (days: number = 30): Promise<any> => {
      const response = await apiClient.get(`/analytics/habits?days=${days}`);
      return response.data;
    },

    getCorrelations: async (): Promise<any> => {
      const response = await apiClient.get('/analytics/correlations');
      return response.data;
    },
  },
};

// Export axios instance for custom requests
export default apiClient;
