import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// Query keys
export const planKeys = {
  all: ['plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  active: () => [...planKeys.all, 'active'] as const,
  detail: (id: number) => [...planKeys.all, 'detail', id] as const,
};

/**
 * Hook to get all user plans
 */
export function usePlans() {
  return useQuery({
    queryKey: planKeys.lists(),
    queryFn: api.plans.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get active plan
 */
export function useActivePlan() {
  return useQuery({
    queryKey: planKeys.active(),
    queryFn: api.plans.getActive,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to get a specific plan by ID
 */
export function usePlan(id: number) {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => api.plans.getById(id),
    enabled: !!id, // Only run if id is provided
  });
}

/**
 * Hook to generate a new plan
 */
export function useGeneratePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: any) => api.plans.generate(preferences),
    onSuccess: () => {
      // Invalidate plans list and active plan
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.active() });
      // Also invalidate journey data as new plan affects it
      queryClient.invalidateQueries({ queryKey: ['journey'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook to delete a plan
 */
export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.plans.delete(id),
    onSuccess: () => {
      // Invalidate plans list
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.active() });
    },
  });
}

/**
 * Convenience hook for all plan operations
 */
export function usePlanActions() {
  const generatePlan = useGeneratePlan();
  const deletePlan = useDeletePlan();

  return {
    generatePlan: generatePlan.mutateAsync,
    deletePlan: deletePlan.mutateAsync,
    isGenerating: generatePlan.isPending,
    isDeleting: deletePlan.isPending,
    generateError: generatePlan.error,
    deleteError: deletePlan.error,
  };
}
