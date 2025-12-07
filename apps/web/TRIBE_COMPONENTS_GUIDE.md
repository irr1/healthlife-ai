# Tribe (Community) Components Guide

Comprehensive guide for all Tribe (Community) page components in HealthLife AI.

## Overview

The Tribe page is the social hub where users join squads, participate in challenges, and compete on leaderboards. It fosters community engagement, accountability, and friendly competition.

---

## Components

### 1. SquadCard

Display card for squads (teams) with member avatars, stats, and join/leave actions.

**Location**: `src/components/tribe/SquadCard.tsx`

**Features**:
- Squad name, description, and rank badge
- Member avatars with online indicators
- Stats grid (members, points, spots left)
- Progress bar for squad capacity
- Hover tooltips on member avatars
- Join/Leave/View actions
- Top 3 rank medals (🥇🥈🥉)
- Member badge for current squad

**Props**:
```typescript
export interface SquadMember {
  id: string
  name: string
  avatar?: string
  level: number
  streak: number
  isOnline?: boolean
}

export interface Squad {
  id: string
  name: string
  description: string
  members: SquadMember[]
  maxMembers: number
  totalPoints: number
  rank?: number
  createdAt: string
}

export interface SquadCardProps {
  squad: Squad
  isUserMember?: boolean
  onJoin?: () => void
  onLeave?: () => void
  onViewDetails?: () => void
}
```

**Usage Example**:
```tsx
const squad: Squad = {
  id: '1',
  name: 'Summer Warriors',
  description: 'Crushing fitness goals together!',
  members: [
    { id: '1', name: 'Alex', level: 12, streak: 45, isOnline: true },
    { id: '2', name: 'Jordan', level: 10, streak: 30 },
  ],
  maxMembers: 10,
  totalPoints: 15750,
  rank: 3,
  createdAt: '2024-01-15',
}

<SquadCard
  squad={squad}
  isUserMember={true}
  onJoin={() => console.log('Join')}
  onLeave={() => console.log('Leave')}
  onViewDetails={() => console.log('View')}
/>
```

**Visual Elements**:
- **Rank Badge**: Purple-pink gradient for top 3, shows rank number
- **Member Avatars**: Circle avatars (max 8 shown, +X for remaining)
- **Online Indicator**: Green dot on bottom-right of avatar
- **Progress Bar**: Blue-purple gradient showing capacity fill
- **Stats Cards**: Blue (members), Purple (points), Green (spots)

---

### 2. ChallengeList

Filterable list of community challenges with status, difficulty, and participation info.

**Location**: `src/components/tribe/ChallengeList.tsx`

**Features**:
- Status filter (all, active, upcoming, completed)
- Challenge cards with icon, title, description
- Difficulty badges (easy, medium, hard)
- Reward points display
- Progress bar for active challenges
- Days remaining counter
- Participant count
- Join/Continue/View actions
- Empty state message

**Props**:
```typescript
export type ChallengeStatus = 'active' | 'upcoming' | 'completed'
export type ChallengeType = 'daily' | 'weekly' | 'monthly'

export interface Challenge {
  id: string
  title: string
  description: string
  type: ChallengeType
  status: ChallengeStatus
  participants: number
  maxParticipants?: number
  reward: number
  progress?: number // 0-100
  startDate: string
  endDate: string
  icon?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface ChallengeListProps {
  challenges: Challenge[]
  onJoinChallenge?: (challengeId: string) => void
  onViewChallenge?: (challengeId: string) => void
  title?: string
}
```

**Usage Example**:
```tsx
const challenges: Challenge[] = [
  {
    id: '1',
    title: '7-Day Water Challenge',
    description: 'Drink 8 glasses of water daily',
    type: 'weekly',
    status: 'active',
    participants: 1245,
    reward: 500,
    progress: 57,
    startDate: '2024-02-05',
    endDate: '2024-02-12',
    icon: '💧',
    difficulty: 'easy',
  },
]

<ChallengeList
  challenges={challenges}
  onJoinChallenge={(id) => console.log('Join:', id)}
  onViewChallenge={(id) => console.log('View:', id)}
/>
```

**Difficulty Colors**:
- **Easy**: Green (#D1FAE5)
- **Medium**: Yellow (#FEF3C7)
- **Hard**: Red (#FEE2E2)

**Status Colors**:
- **Active**: Blue background (#DBEAFE)
- **Upcoming**: Purple background (#F3E8FF)
- **Completed**: Gray background (#F3F4F6)

**Type Icons**:
- Daily: 📅
- Weekly: 📆
- Monthly: 🗓️

---

### 3. Leaderboard

Ranked list of users with points, levels, and streaks.

**Location**: `src/components/tribe/Leaderboard.tsx`

**Features**:
- Type filter (global, squad, friends)
- Period filter (daily, weekly, monthly, all time)
- Top 3 medal badges
- Rank change indicators (↑↓)
- Current user highlighting
- User avatar or initial
- Points, level, and streak display
- User position section (if not in top list)

**Props**:
```typescript
export type LeaderboardType = 'global' | 'squad' | 'friends'
export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'allTime'

export interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatar?: string
  points: number
  streak: number
  level: number
  change?: number // +/- rank change
  isCurrentUser?: boolean
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[]
  type?: LeaderboardType
  period?: LeaderboardPeriod
  onTypeChange?: (type: LeaderboardType) => void
  onPeriodChange?: (period: LeaderboardPeriod) => void
  title?: string
  showFilters?: boolean
}
```

**Usage Example**:
```tsx
const entries: LeaderboardEntry[] = [
  {
    id: '1',
    rank: 1,
    name: 'Emma Wilson',
    points: 15420,
    streak: 60,
    level: 15,
    change: 2,
  },
  {
    id: '2',
    rank: 6,
    name: 'You',
    points: 9850,
    streak: 21,
    level: 8,
    change: -2,
    isCurrentUser: true,
  },
]

<Leaderboard
  entries={entries}
  type="global"
  period="weekly"
  onTypeChange={(type) => console.log('Type:', type)}
  onPeriodChange={(period) => console.log('Period:', period)}
/>
```

**Rank Colors**:
- **#1**: Gold gradient (#FBBF24 → #F59E0B)
- **#2**: Silver gradient (#D1D5DB → #6B7280)
- **#3**: Bronze gradient (#FB923C → #EA580C)
- **#4+**: Gray gradient (#E5E7EB → #9CA3AF)

**Highlighting**:
- Current user row: Blue background (#DBEAFE) with blue border

---

## Page Integration

### Tribe Page Structure

**Location**: `src/app/(dashboard)/tribe/page.tsx`

Layout:
```
┌─────────────────────────────────────────┐
│ Page Header                             │
├─────────────────────────────────────────┤
│ Squads Section (2-column grid)         │
│ ┌─────────────┬─────────────┐          │
│ │ Squad Card  │ Squad Card  │          │
│ └─────────────┴─────────────┘          │
├────────────────────────────┬────────────┤
│ ChallengeList (2/3)        │ Leaderboard│
│                            │ (1/3)      │
│                            │            │
└────────────────────────────┴────────────┘
```

### State Management

```tsx
const [userSquadId] = useState('1')
const { showToast } = useToast()

const handleJoinSquad = (squadId: string) => {
  // Call API to join squad
  showToast({ type: 'success', title: 'Joined squad!' })
}

const handleJoinChallenge = (challengeId: string) => {
  // Call API to join challenge
  showToast({ type: 'success', title: 'Challenge joined!' })
}
```

### Mock Data

Current implementation uses mock data:
- **mockSquads**: 3 squads with different ranks and member counts
- **mockChallenges**: 5 challenges (active, upcoming, completed)
- **mockLeaderboard**: 7 entries including current user

All marked with `// TODO: Replace with API calls`

---

## API Integration (Future)

### Expected API Endpoints

1. **GET /api/v1/tribe/squads**
   ```typescript
   // Get all available squads
   Response: { squads: Squad[] }
   ```

2. **POST /api/v1/tribe/squads/:id/join**
   ```typescript
   // Join a squad
   Response: { success: boolean, squad: Squad }
   ```

3. **POST /api/v1/tribe/squads/:id/leave**
   ```typescript
   // Leave a squad
   Response: { success: boolean }
   ```

4. **GET /api/v1/tribe/challenges**
   ```typescript
   // Get challenges
   Query: { status?: ChallengeStatus }
   Response: { challenges: Challenge[] }
   ```

5. **POST /api/v1/tribe/challenges/:id/join**
   ```typescript
   // Join a challenge
   Response: { success: boolean, challenge: Challenge }
   ```

6. **GET /api/v1/tribe/leaderboard**
   ```typescript
   // Get leaderboard
   Query: { type: LeaderboardType, period: LeaderboardPeriod }
   Response: { entries: LeaderboardEntry[] }
   ```

### Integration Example

```tsx
// Fetch squads
useEffect(() => {
  async function fetchSquads() {
    try {
      const response = await fetch('/api/tribe/squads')
      const data = await response.json()
      setSquads(data.squads)
    } catch (error) {
      showToast({ type: 'error', title: 'Failed to load squads' })
    }
  }

  fetchSquads()
}, [])

// Join squad
const handleJoinSquad = async (squadId: string) => {
  try {
    const response = await fetch(`/api/tribe/squads/${squadId}/join`, {
      method: 'POST',
    })

    const data = await response.json()
    setUserSquadId(squadId)
    showToast({ type: 'success', title: 'Joined squad!' })
  } catch (error) {
    showToast({ type: 'error', title: 'Failed to join squad' })
  }
}
```

---

## Styling & Theming

### Color Scheme

**Squad Ranks**:
- Rank 1-3: Purple-pink gradient (#A855F7 → #EC4899)
- Member avatars: Blue-purple gradient (#60A5FA → #A78BFA)
- Progress bar: Blue-purple gradient (#3B82F6 → #9333EA)

**Challenge Status**:
- Active: Blue (#3B82F6)
- Upcoming: Purple (#9333EA)
- Completed: Gray (#6B7280)

**Leaderboard Ranks**:
- Gold: #FBBF24
- Silver: #D1D5DB
- Bronze: #FB923C

### Responsive Breakpoints

- **Mobile** (<1024px): Single column, stacked components
- **Desktop** (≥1024px): Multi-column layouts (2-col squads, 2/3 + 1/3 challenges/leaderboard)

---

## Best Practices

1. **Squad Management**:
   - Users can only be in one squad at a time
   - Show "Leave" button only for current squad
   - Disable "Join" for full squads
   - Display rank prominently for top squads

2. **Challenge Design**:
   - Clear difficulty indicators
   - Show days remaining for urgency
   - Display progress for active challenges
   - Limit max participants when applicable

3. **Leaderboard**:
   - Update in real-time or near real-time
   - Always show current user (even if not in top)
   - Indicate rank changes from previous period
   - Filter by relevant groups (squad, friends)

4. **Performance**:
   - Paginate large leaderboards
   - Cache squad/challenge data
   - Lazy load member avatars
   - Debounce filter changes

---

## Interactive Features

### SquadCard Interactions

1. **Member Hover**: Shows name, level, and streak in tooltip
2. **Online Indicator**: Green ring for active members
3. **Join/Leave**: Instant feedback with toast notifications
4. **Capacity Bar**: Visual fill shows available spots

### ChallengeList Interactions

1. **Status Filter**: Quick switch between challenge types
2. **Progress Bar**: Shows completion for active challenges
3. **Reward Display**: Prominent points badge
4. **Action Buttons**: Context-aware (Join, Continue, View Results)

### Leaderboard Interactions

1. **Type/Period Filters**: Instant data refresh
2. **Rank Change**: Visual arrows showing movement
3. **Current User**: Highlighted row for easy identification
4. **Scroll to User**: Auto-scroll to current user position

---

## Component Checklist

- [x] SquadCard.tsx - Squad team display
- [x] ChallengeList.tsx - Challenge browser
- [x] Leaderboard.tsx - Rankings table
- [x] index.ts - Component exports
- [x] tribe/page.tsx - Integrated page with mock data
- [ ] API integration (Phase 3)
- [ ] Squad detail modal
- [ ] Challenge detail modal
- [ ] Real-time leaderboard updates

---

## Testing the Tribe Page

1. **Start the development server**:
   ```bash
   cd apps/web
   npm run dev
   ```

2. **Navigate to Tribe page**:
   ```
   http://localhost:3000/tribe
   ```

3. **Test interactions**:
   - **Squads**: Join/Leave different squads, hover on member avatars
   - **Challenges**: Filter by status, join challenges
   - **Leaderboard**: Switch between type/period filters

4. **Verify components**:
   - ✅ SquadCard displays 3 squads with member info
   - ✅ ChallengeList shows 5 challenges with filters
   - ✅ Leaderboard displays 7 entries with current user highlighted
   - ✅ Toast notifications work for all actions
   - ✅ Responsive layout adapts to screen size

---

## Troubleshooting

### Squad Capacity Not Updating

**Issue**: Progress bar doesn't reflect member count
**Fix**: Ensure `members.length` and `maxMembers` are correct

### Challenge Filter Not Working

**Issue**: All challenges shown regardless of filter
**Fix**: Check filter logic in `filteredChallenges`

### Current User Not Highlighted

**Issue**: User row looks like others
**Fix**: Ensure `isCurrentUser: true` in leaderboard entry

### Online Indicators Not Showing

**Issue**: No green dots on avatars
**Fix**: Check `isOnline` property on squad members

---

## Advanced Features (Future)

1. **Squad Chat**: Real-time messaging within squads
2. **Challenge Brackets**: Tournament-style competitions
3. **Custom Challenges**: Users create their own challenges
4. **Squad Achievements**: Unlock badges as a team
5. **Leaderboard History**: View past rankings
6. **Squad Invitations**: Invite specific users to join
7. **Challenge Notifications**: Daily reminders
8. **Voice Rooms**: Audio chat for squads
9. **Achievement Showcase**: Display earned badges
10. **Social Sharing**: Share progress on social media

---

## Resources

- [Gamification Best Practices](https://www.interaction-design.org/literature/article/gamification-and-ux-where-users-win-or-lose)
- [Community Building](https://www.feverbee.com/community-building/)
- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Project architecture
- [FOCUS_COMPONENTS_GUIDE.md](./FOCUS_COMPONENTS_GUIDE.md) - Focus components
- [JOURNEY_COMPONENTS_GUIDE.md](./JOURNEY_COMPONENTS_GUIDE.md) - Journey components
- [COACH_COMPONENTS_GUIDE.md](./COACH_COMPONENTS_GUIDE.md) - Coach components
- [YOU_COMPONENTS_GUIDE.md](./YOU_COMPONENTS_GUIDE.md) - You components

---

**Last Updated**: Phase 2 - UI Components (Week 1)
**Status**: ✅ Complete
**Next Phase**: Backend API Development (Phase 3)
