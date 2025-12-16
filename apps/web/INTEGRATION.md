# Frontend-Backend Integration Guide

## ✅ Completed Integration Setup

### 1. API Client (`src/lib/api-client.ts`)
- Axios instance configured with base URL: `http://127.0.0.1:8000/api/v1`
- JWT token authentication with automatic token injection
- Automatic token refresh on 401 errors
- Comprehensive error handling
- All 28 backend endpoints covered

### 2. React Query Setup
- **Provider**: `src/providers/QueryProvider.tsx` added to root layout
- **DevTools**: React Query DevTools enabled in development mode
- **Configuration**:
  - 5 minute stale time
  - 10 minute cache time
  - Automatic refetch on reconnect
  - Retry failed requests once

### 3. Custom Hooks

#### User Hooks (`src/hooks/useUser.ts`)
- `useUser()` - Get current user data
- `useUpdateUser()` - Update user profile
- `useIsAuthenticated()` - Check authentication status
- `useAuth()` - Login, register, logout actions

#### Plans Hooks (`src/hooks/usePlans.ts`)
- `usePlans()` - Get all user plans
- `useActivePlan()` - Get active plan
- `usePlan(id)` - Get specific plan
- `useGeneratePlan()` - Generate new plan
- `useDeletePlan()` - Delete a plan
- `usePlanActions()` - Convenience hook for all plan mutations

#### Tasks Hooks (`src/hooks/useTasks.ts`)
- `useTodayTasks()` - Get today's tasks
- `useUpcomingTasks(days)` - Get upcoming tasks
- `useTask(id)` - Get specific task
- `useCompleteTask()` - Mark task as complete
- `useSkipTask()` - Skip a task
- `useRescheduleTask()` - Reschedule a task
- `useTaskActions()` - Convenience hook for all task mutations

#### Journey Hooks (`src/hooks/useJourney.ts`)
- `useRoadmap()` - Get journey roadmap
- `useMilestones()` - Get milestones
- `useProgress()` - Get journey progress
- `useSubmitWeeklyReview()` - Submit weekly review
- `useJourneyData()` - Get all journey data at once

#### Coach Hooks (`src/hooks/useCoach.ts`)
- `useChatWithCoach()` - Chat with AI coach
- `useDailyInsight()` - Get daily insight
- `useKnowledgeSearch(query)` - Search knowledge base
- `useAdjustPlan()` - Request plan adjustments
- `useCoach()` - Convenience hook for coach features

#### Analytics Hooks (`src/hooks/useAnalytics.ts`)
- `useBodyBattery(days)` - Get energy/body battery chart
- `useHabitsAnalytics(days)` - Get habits completion analytics
- `useCorrelations()` - Get health correlations (Pro feature)
- `useAnalytics()` - Get all analytics data at once

### 4. Usage Examples

```typescript
// Authentication
import { useAuth } from '@/hooks/useUser';

function LoginPage() {
  const { login, isLoggingIn } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ username: 'user@example.com', password: 'password' });
      // Redirect to dashboard
    } catch (error) {
      // Handle error
    }
  };
}

// Fetching data
import { useTodayTasks } from '@/hooks/useTasks';

function TasksList() {
  const { data: tasks, isLoading, error } = useTodayTasks();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div>
      {tasks?.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}

// Mutations
import { useCompleteTask } from '@/hooks/useTasks';

function TaskItem({ taskId }) {
  const { mutateAsync: completeTask } = useCompleteTask();

  const handleComplete = async () => {
    try {
      await completeTask({ taskId, notes: 'Great job!' });
      // Task completed, cache automatically updated
    } catch (error) {
      // Handle error
    }
  };

  return <button onClick={handleComplete}>Complete</button>;
}
```

## 🔄 Automatic Cache Management

All hooks automatically handle cache invalidation:
- Completing a task → invalidates `tasks` and `journey.progress`
- Generating a plan → invalidates `plans`, `journey`, and `tasks`
- Submitting weekly review → invalidates `journey.progress`
- Updating user profile → updates `user.me` cache

## 🚀 Next Steps

1. Replace stub data in pages with real API calls using hooks
2. Add authentication pages (login, register)
3. Implement protected routes
4. Add error boundaries
5. Set up environment variables for API URL

## 📝 Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

## 🔒 Authentication Flow

1. User logs in → tokens saved to localStorage
2. API client adds token to all requests automatically
3. On 401 error → attempts token refresh
4. If refresh succeeds → retries original request
5. If refresh fails → clears tokens and redirects to login

## ✅ Build Status

- ✅ TypeScript compilation successful
- ✅ Next.js build successful
- ⚠️ Some ESLint warnings (non-critical)
- ✅ All components render without errors
