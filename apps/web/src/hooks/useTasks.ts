import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  today: () => [...taskKeys.all, 'today'] as const,
  upcoming: (days?: number) => [...taskKeys.all, 'upcoming', days] as const,
  detail: (id: number) => [...taskKeys.all, 'detail', id] as const,
};

/**
 * Hook to get today's tasks
 */
export function useTodayTasks() {
  return useQuery({
    queryKey: taskKeys.today(),
    queryFn: api.tasks.getToday,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * Hook to get upcoming tasks
 */
export function useUpcomingTasks(days: number = 7) {
  return useQuery({
    queryKey: taskKeys.upcoming(days),
    queryFn: () => api.tasks.getUpcoming(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a specific task by ID
 */
export function useTask(id: number) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => api.tasks.getById(id),
    enabled: !!id, // Only run query if id is provided
  });
}

/**
 * Hook to complete a task
 */
export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, notes }: { taskId: number; notes?: string }) =>
      api.tasks.complete(taskId, notes),
    onSuccess: () => {
      // Invalidate today's tasks and upcoming tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.today() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
      // Also invalidate journey progress since task completion affects it
      queryClient.invalidateQueries({ queryKey: ['journey', 'progress'] });
    },
  });
}

/**
 * Hook to skip a task
 */
export function useSkipTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, reason }: { taskId: number; reason?: string }) =>
      api.tasks.skip(taskId, reason),
    onSuccess: () => {
      // Invalidate today's tasks and upcoming tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.today() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
}

/**
 * Hook to reschedule a task
 */
export function useRescheduleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, newDate }: { taskId: number; newDate: string }) =>
      api.tasks.reschedule(taskId, newDate),
    onSuccess: () => {
      // Invalidate today's tasks and upcoming tasks
      queryClient.invalidateQueries({ queryKey: taskKeys.today() });
      queryClient.invalidateQueries({ queryKey: taskKeys.upcoming() });
    },
  });
}

/**
 * Convenience hook for all task mutations
 */
export function useTaskActions() {
  const completeTask = useCompleteTask();
  const skipTask = useSkipTask();
  const rescheduleTask = useRescheduleTask();

  return {
    completeTask: completeTask.mutateAsync,
    skipTask: skipTask.mutateAsync,
    rescheduleTask: rescheduleTask.mutateAsync,
    isCompleting: completeTask.isPending,
    isSkipping: skipTask.isPending,
    isRescheduling: rescheduleTask.isPending,
    completeError: completeTask.error,
    skipError: skipTask.error,
    rescheduleError: rescheduleTask.error,
  };
}
