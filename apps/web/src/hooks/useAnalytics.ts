import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// Query keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  bodyBattery: (days?: number) => [...analyticsKeys.all, 'body-battery', days] as const,
  habits: (days?: number) => [...analyticsKeys.all, 'habits', days] as const,
  correlations: () => [...analyticsKeys.all, 'correlations'] as const,
};

/**
 * Hook to get body battery / energy chart
 */
export function useBodyBattery(days: number = 7) {
  return useQuery({
    queryKey: analyticsKeys.bodyBattery(days),
    queryFn: () => api.analytics.getBodyBattery(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get habits analytics
 */
export function useHabitsAnalytics(days: number = 30) {
  return useQuery({
    queryKey: analyticsKeys.habits(days),
    queryFn: () => api.analytics.getHabits(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get correlations analytics (Pro feature)
 */
export function useCorrelations() {
  return useQuery({
    queryKey: analyticsKeys.correlations(),
    queryFn: api.analytics.getCorrelations,
    staleTime: 60 * 60 * 1000, // 1 hour - correlations don't change frequently
  });
}

/**
 * Convenience hook to get all analytics data
 */
export function useAnalytics(bodyBatteryDays: number = 7, habitsDays: number = 30) {
  const bodyBattery = useBodyBattery(bodyBatteryDays);
  const habits = useHabitsAnalytics(habitsDays);
  const correlations = useCorrelations();

  return {
    bodyBattery: bodyBattery.data,
    habits: habits.data,
    correlations: correlations.data,
    isLoading: bodyBattery.isLoading || habits.isLoading || correlations.isLoading,
    isError: bodyBattery.isError || habits.isError || correlations.isError,
    error: bodyBattery.error || habits.error || correlations.error,
  };
}
