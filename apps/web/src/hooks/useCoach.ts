import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

// Query keys
export const coachKeys = {
  all: ['coach'] as const,
  insight: () => [...coachKeys.all, 'insight'] as const,
  knowledge: (query?: string, category?: string) =>
    [...coachKeys.all, 'knowledge', query, category] as const,
};

/**
 * Hook to chat with AI coach
 */
export function useChatWithCoach() {
  return useMutation({
    mutationFn: ({ message, context }: { message: string; context?: string }) =>
      api.coach.chat(message, context),
  });
}

/**
 * Hook to get daily insight
 */
export function useDailyInsight() {
  return useQuery({
    queryKey: coachKeys.insight(),
    queryFn: api.coach.getDailyInsight,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - daily insight
    refetchOnMount: false, // Don't refetch on mount
    refetchOnWindowFocus: false, // Don't refetch on focus
  });
}

/**
 * Hook to search knowledge base
 */
export function useKnowledgeSearch(query: string, category?: string, limit: number = 5) {
  return useQuery({
    queryKey: coachKeys.knowledge(query, category),
    queryFn: () => api.coach.searchKnowledge(query, category, limit),
    enabled: query.length > 0, // Only run if query is not empty
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to request plan adjustment
 */
export function useAdjustPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reason,
      changes,
      priority,
    }: {
      reason: string;
      changes: string[];
      priority?: string;
    }) => api.coach.adjustPlan(reason, changes, priority),
    onSuccess: () => {
      // Invalidate plans after adjustment request
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
}

/**
 * Convenience hook for all coach features
 */
export function useCoach() {
  const chat = useChatWithCoach();
  const adjustPlan = useAdjustPlan();
  const insight = useDailyInsight();

  return {
    chat: chat.mutateAsync,
    adjustPlan: adjustPlan.mutateAsync,
    dailyInsight: insight.data,
    isChatting: chat.isPending,
    isAdjustingPlan: adjustPlan.isPending,
    isLoadingInsight: insight.isLoading,
    chatError: chat.error,
    adjustPlanError: adjustPlan.error,
    insightError: insight.error,
  };
}
