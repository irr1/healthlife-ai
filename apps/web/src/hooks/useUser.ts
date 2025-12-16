import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, UserResponse } from '@/lib/api-client';

// Query keys
export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

/**
 * Hook to get current user data
 */
export function useUser() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: api.users.getMe,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update current user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { full_name?: string; email?: string }) => api.users.updateMe(data),
    onSuccess: (updatedUser) => {
      // Update the cache with new user data
      queryClient.setQueryData(userKeys.me(), updatedUser);
    },
  });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: user, isLoading, isError } = useUser();
  return {
    isAuthenticated: !!user && !isError,
    isLoading,
    user,
  };
}

/**
 * Hook for authentication actions (login, register, logout)
 */
export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: api.auth.login,
    onSuccess: async () => {
      // Fetch user data after successful login
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  const registerMutation = useMutation({
    mutationFn: api.auth.register,
    onSuccess: async () => {
      // After registration, tokens are saved, so fetch user data
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  const logout = () => {
    api.auth.logout();
    // Clear all queries on logout
    queryClient.clear();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
