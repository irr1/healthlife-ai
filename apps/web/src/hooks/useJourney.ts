import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// Query keys
export const journeyKeys = {
  all: ['journey'] as const,
  roadmap: () => [...journeyKeys.all, 'roadmap'] as const,
  milestones: () => [...journeyKeys.all, 'milestones'] as const,
  progress: () => [...journeyKeys.all, 'progress'] as const,
};

/**
 * Hook to get user's journey roadmap
 */
export function useRoadmap() {
  return useQuery({
    queryKey: journeyKeys.roadmap(),
    queryFn: api.journey.getRoadmap,
    staleTime: 10 * 60 * 1000, // 10 minutes - roadmap doesn't change often
  });
}

/**
 * Hook to get journey milestones
 */
export function useMilestones() {
  return useQuery({
    queryKey: journeyKeys.milestones(),
    queryFn: api.journey.getMilestones,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get journey progress
 */
export function useProgress() {
  return useQuery({
    queryKey: journeyKeys.progress(),
    queryFn: api.journey.getProgress,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * Hook to submit weekly review
 */
export function useSubmitWeeklyReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: {
      week_number: number;
      wins: string[];
      challenges: string[];
      lessons: string[];
      energy_average: number;
      notes?: string;
    }) => api.journey.submitWeeklyReview(review),
    onSuccess: () => {
      // Invalidate progress after submitting review
      queryClient.invalidateQueries({ queryKey: journeyKeys.progress() });
    },
  });
}

/**
 * Convenience hook to get all journey data
 */
export function useJourneyData() {
  const roadmap = useRoadmap();
  const milestones = useMilestones();
  const progress = useProgress();

  return {
    roadmap: roadmap.data,
    milestones: milestones.data,
    progress: progress.data,
    isLoading: roadmap.isLoading || milestones.isLoading || progress.isLoading,
    isError: roadmap.isError || milestones.isError || progress.isError,
    error: roadmap.error || milestones.error || progress.error,
  };
}
