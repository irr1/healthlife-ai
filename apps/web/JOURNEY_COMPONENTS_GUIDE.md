# Journey Components Guide

Comprehensive guide for all Journey page components in HealthLife AI.

## Overview

The Journey page displays the user's health transformation roadmap, milestones, weekly reviews, and motivational reminders. It's designed to help users visualize their progress, stay motivated, and track their achievements.

---

## Components

### 1. RoadmapVisualizer

Visual roadmap component that displays the user's journey in phases.

**Location**: `src/components/journey/RoadmapVisualizer.tsx`

**Features**:
- Displays multiple phases in a vertical timeline
- Three phase states: completed (green), current (blue), locked (gray)
- Progress bar for current phase
- Connector lines between phases
- Click handling for phase interaction
- Responsive design with hover effects

**Props**:
```typescript
export interface Phase {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'locked'
  progress?: number        // 0-100, only for current phase
  startDate?: string
  endDate?: string
}

export interface RoadmapVisualizerProps {
  phases: Phase[]
  onPhaseClick?: (phaseId: string) => void
}
```

**Usage Example**:
```tsx
const phases: Phase[] = [
  {
    id: '1',
    title: 'Phase 1: Foundation',
    description: 'Build basic habits and establish routine',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-01-28',
  },
  {
    id: '2',
    title: 'Phase 2: Growth',
    description: 'Increase intensity and challenge yourself',
    status: 'current',
    progress: 65,
    startDate: '2024-01-29',
  },
]

<RoadmapVisualizer
  phases={phases}
  onPhaseClick={(id) => console.log('Phase clicked:', id)}
/>
```

**Visual States**:
- **Completed**: Green border, green badge, checkmark icon, completed date shown
- **Current**: Blue border, blue badge, target icon, progress bar displayed
- **Locked**: Gray border, gray badge, lock icon, disabled state

---

### 2. MilestoneCard

Component for displaying categorized milestones with completion tracking.

**Location**: `src/components/journey/MilestoneCard.tsx`

**Features**:
- Categorized milestones (weight, habit, workout, nutrition, other)
- Separate sections for upcoming and completed
- Color-coded by category
- Progress tracking (current vs target)
- Deadline display
- Trophy icon for completed milestones

**Props**:
```typescript
export interface Milestone {
  id: string
  title: string
  description?: string
  target: string           // e.g., "-2 kg", "7 days streak"
  current?: string         // current progress
  isCompleted: boolean
  icon?: string
  category?: 'weight' | 'habit' | 'workout' | 'nutrition' | 'other'
  deadline?: string
}

export interface MilestoneCardProps {
  milestones: Milestone[]
  title?: string
}
```

**Category Colors**:
- **weight**: Blue (⚖️)
- **habit**: Green (✅)
- **workout**: Orange (💪)
- **nutrition**: Purple (🥗)
- **other**: Gray (🎯)

**Usage Example**:
```tsx
const milestones: Milestone[] = [
  {
    id: '1',
    title: 'Lose First 2kg',
    description: 'First weight milestone',
    target: '-2 kg',
    current: '-1.5 kg',
    isCompleted: false,
    category: 'weight',
    deadline: 'Feb 15, 2024',
  },
  {
    id: '2',
    title: '7-Day Streak',
    target: '7 days',
    isCompleted: true,
    category: 'habit',
  },
]

<MilestoneCard milestones={milestones} title="🏆 Milestones" />
```

---

### 3. WhyBlock

Motivational reminder component displaying the user's "why" - their reason for starting.

**Location**: `src/components/journey/WhyBlock.tsx`

**Features**:
- Gradient purple-pink background
- Displays user's reason for starting
- Shows goal and start date
- Motivational quote
- Edit functionality
- Visually prominent design

**Props**:
```typescript
export interface WhyBlockProps {
  reason: string
  goal?: string
  dateStarted?: string
  onEdit?: () => void
}
```

**Usage Example**:
```tsx
<WhyBlock
  reason="I want to feel energized, confident, and be able to play with my kids without getting tired"
  goal="Lose 10kg and build sustainable healthy habits"
  dateStarted="January 1, 2024"
  onEdit={() => console.log('Edit clicked')}
/>
```

**Design Philosophy**:
The WhyBlock is intentionally designed to be visually striking with a gradient background. It serves as a constant reminder of why the user started their journey, helping maintain motivation during difficult times.

---

### 4. WeeklyReview

Component for displaying weekly performance summary and statistics.

**Location**: `src/components/journey/WeeklyReview.tsx`

**Features**:
- Task completion rate with color-coded progress bar
- Streak tracking
- Top performing habits
- Areas for improvement
- Performance badges (Excellent/Good/Keep Going)
- "Generate Next Week" functionality
- Days until week end counter

**Props**:
```typescript
export interface WeeklyStats {
  tasksCompleted: number
  totalTasks: number
  completionRate: number
  streak: number
  topHabits: string[]
  improvements: string[]
}

export interface WeeklyReviewProps {
  week: number
  stats: WeeklyStats
  isCurrentWeek?: boolean
  onGenerateNextWeek?: () => void
  onViewDetails?: () => void
}
```

**Performance Badges**:
- **≥80%**: "🏆 Excellent Week!" (Yellow gradient)
- **50-79%**: "✨ Good Progress!" (Green gradient)
- **<50%**: "💙 Keep Going!" (Blue gradient)

**Usage Example**:
```tsx
const stats: WeeklyStats = {
  tasksCompleted: 18,
  totalTasks: 21,
  completionRate: 86,
  streak: 5,
  topHabits: ['Morning workout', 'Drinking 2L water', 'Meditation'],
  improvements: ['Evening routine consistency', 'Meal planning'],
}

<WeeklyReview
  week={2}
  stats={stats}
  isCurrentWeek={true}
  onViewDetails={() => console.log('View details')}
  onGenerateNextWeek={() => console.log('Generate next week')}
/>
```

---

## Page Integration

### Journey Page Structure

**Location**: `src/app/(dashboard)/journey/page.tsx`

The Journey page is organized in the following layout:

```
┌─────────────────────────────────────────┐
│ Page Header                             │
├─────────────────────────────────────────┤
│ WhyBlock (Full Width)                   │
├────────────────────────────┬────────────┤
│ RoadmapVisualizer (2/3)    │ Milestones │
│                            │ Card (1/3) │
├────────────────────────────┤            │
│ WeeklyReview (2/3)         │            │
└────────────────────────────┴────────────┘
│ Stats Footer (4 columns)                │
└─────────────────────────────────────────┘
```

### State Management

```tsx
// Mock data - TODO: Replace with API calls
const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones)
const { showToast } = useToast()

// Event handlers
const handlePhaseClick = (phaseId: string) => {
  const phase = mockPhases.find((p) => p.id === phaseId)
  if (phase?.status === 'locked') {
    showToast({ type: 'info', title: 'Phase locked!' })
  }
  // ... other logic
}
```

### Mock Data

The page currently uses mock data marked with `// TODO: Replace with API calls`:

- **mockPhases**: 4 phases (Foundation, Growth, Mastery, Legacy)
- **mockMilestones**: 5 milestones across different categories
- **mockWeeklyStats**: Weekly performance data

---

## API Integration (Future)

### Expected API Endpoints

1. **GET /api/v1/journey/roadmap**
   ```typescript
   // Returns user's journey phases
   Response: { phases: Phase[] }
   ```

2. **GET /api/v1/journey/milestones**
   ```typescript
   // Returns user's milestones
   Response: { milestones: Milestone[] }
   ```

3. **GET /api/v1/journey/why**
   ```typescript
   // Returns user's motivation
   Response: { reason: string, goal: string, dateStarted: string }
   ```

4. **PUT /api/v1/journey/why**
   ```typescript
   // Updates user's motivation
   Body: { reason: string, goal?: string }
   ```

5. **GET /api/v1/journey/weekly-review/:week**
   ```typescript
   // Returns weekly review data
   Response: { stats: WeeklyStats }
   ```

6. **POST /api/v1/journey/generate-week**
   ```typescript
   // AI generates next week plan
   Response: { weekPlan: Task[], insights: string }
   ```

### Integration Example

```tsx
// Replace mock data with API calls
useEffect(() => {
  async function fetchJourneyData() {
    const [phases, milestones, weeklyStats] = await Promise.all([
      fetch('/api/journey/roadmap').then(r => r.json()),
      fetch('/api/journey/milestones').then(r => r.json()),
      fetch('/api/journey/weekly-review/current').then(r => r.json()),
    ])

    setPhases(phases)
    setMilestones(milestones)
    setWeeklyStats(weeklyStats)
  }

  fetchJourneyData()
}, [])
```

---

## Styling & Theming

### Color Scheme

- **Completed**: Green (#10B981)
- **Current/Active**: Blue (#3B82F6)
- **Locked/Disabled**: Gray (#9CA3AF)
- **Weight**: Blue (#60A5FA)
- **Habit**: Green (#34D399)
- **Workout**: Orange (#FB923C)
- **Nutrition**: Purple (#A78BFA)

### Responsive Breakpoints

- **Mobile** (<768px): Single column layout
- **Desktop** (≥1024px): Two-column layout (2/3 + 1/3)

---

## Best Practices

1. **Mock Data**: Always mark mock data with `// TODO: Replace with API calls`
2. **Error Handling**: Add try-catch blocks when integrating real API calls
3. **Loading States**: Show skeleton loaders while fetching data
4. **Empty States**: Handle cases where user has no milestones or incomplete data
5. **Optimistic Updates**: Update UI immediately, then sync with backend
6. **Toast Feedback**: Use toasts for all user actions

---

## Component Checklist

- [x] RoadmapVisualizer.tsx - Visual roadmap with phases
- [x] MilestoneCard.tsx - Categorized milestone display
- [x] WhyBlock.tsx - Motivational reminder
- [x] WeeklyReview.tsx - Weekly performance summary
- [x] index.ts - Component exports
- [x] journey/page.tsx - Integrated page with mock data
- [ ] API integration (Phase 3)
- [ ] Loading states
- [ ] Error boundaries
- [ ] Empty states

---

## Next Steps

After completing Journey components, the next phase includes:

### Coach Components
- ChatWindow.tsx - AI conversation interface
- MessageBubble.tsx - Chat message display
- DailyInsight.tsx - AI-generated insights

### You (Profile) Components
- BodyBattery.tsx - Energy level visualization
- HabitGrid.tsx - Habit tracking calendar
- BiometricsChart.tsx - Health metrics charts

### Tribe (Community) Components
- SquadCard.tsx - User squad/team display
- Leaderboard.tsx - Community leaderboard
- ChallengeList.tsx - Active challenges

---

## Testing the Journey Page

1. **Start the development server**:
   ```bash
   cd apps/web
   npm run dev
   ```

2. **Navigate to Journey page**:
   ```
   http://localhost:3000/journey
   ```

3. **Test interactions**:
   - Click on different phases (completed, current, locked)
   - Click "Update Your Why" button
   - Click "View Detailed Report"
   - Observe toast notifications
   - Check responsive layout on mobile

4. **Verify components**:
   - ✅ RoadmapVisualizer displays all 4 phases
   - ✅ MilestoneCard shows upcoming and completed sections
   - ✅ WhyBlock displays motivation with gradient background
   - ✅ WeeklyReview shows stats and performance badge
   - ✅ Stats footer displays 4 metric cards

---

## Troubleshooting

### TypeScript Errors

**Issue**: `showToast` expects 1 argument but got 2
**Fix**: Use object syntax:
```tsx
// ❌ Wrong
showToast('Message', 'success')

// ✅ Correct
showToast({ type: 'success', title: 'Message' })
```

### Layout Issues

**Issue**: Components overflow on mobile
**Fix**: Check responsive classes (`grid-cols-1 lg:grid-cols-3`)

### Missing Data

**Issue**: Components show empty state
**Fix**: Ensure mock data is properly imported and not empty

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Project architecture
- [FOCUS_COMPONENTS_GUIDE.md](./FOCUS_COMPONENTS_GUIDE.md) - Focus components guide

---

**Last Updated**: Phase 2 - UI Components (Week 1)
**Status**: ✅ Complete
**Next Phase**: Coach Components
