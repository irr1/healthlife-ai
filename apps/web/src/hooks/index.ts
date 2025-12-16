// User hooks
export {
  useUser,
  useUpdateUser,
  useIsAuthenticated,
  useAuth,
  userKeys,
} from './useUser';

// Plans hooks
export {
  usePlans,
  useActivePlan,
  usePlan,
  useGeneratePlan,
  useDeletePlan,
  usePlanActions,
  planKeys,
} from './usePlans';

// Tasks hooks
export {
  useTodayTasks,
  useUpcomingTasks,
  useTask,
  useCompleteTask,
  useSkipTask,
  useRescheduleTask,
  useTaskActions,
  taskKeys,
} from './useTasks';

// Journey hooks
export {
  useRoadmap,
  useMilestones,
  useProgress,
  useSubmitWeeklyReview,
  useJourneyData,
  journeyKeys,
} from './useJourney';

// Coach hooks
export {
  useChatWithCoach,
  useDailyInsight,
  useKnowledgeSearch,
  useAdjustPlan,
  useCoach,
  coachKeys,
} from './useCoach';

// Analytics hooks
export {
  useBodyBattery,
  useHabitsAnalytics,
  useCorrelations,
  useAnalytics,
  analyticsKeys,
} from './useAnalytics';
