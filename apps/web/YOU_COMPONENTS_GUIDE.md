# You (Profile) Components Guide

Comprehensive guide for all You (Profile) page components in HealthLife AI.

## Overview

The You page is the personal hub where users track their energy levels, monitor habits, view biometric data, and manage profile settings. It provides comprehensive data visualization and personalization options.

---

## Components

### 1. BodyBattery

Energy level visualization component that displays the user's "body battery" throughout the day.

**Location**: `src/components/you/BodyBattery.tsx`

**Features**:
- Current energy level display with battery icon
- Energy timeline chart (SVG-based line chart)
- Color-coded battery indicator (green → yellow → orange → red)
- Peak, average, and current statistics
- Contextual tips based on energy level
- Gradient area fill for better visualization
- Hover tooltips on data points

**Props**:
```typescript
export interface EnergyLevel {
  time: string          // e.g., "6:00", "14:00"
  level: number         // 0-100
  activity?: string     // Optional activity label
}

export interface BodyBatteryProps {
  energyLevels: EnergyLevel[]
  currentLevel?: number
  title?: string
}
```

**Usage Example**:
```tsx
const energyLevels: EnergyLevel[] = [
  { time: '6:00', level: 45, activity: 'Woke up' },
  { time: '8:00', level: 70, activity: 'Morning workout' },
  { time: '12:00', level: 80, activity: 'Lunch' },
  { time: '18:00', level: 60, activity: 'Evening walk' },
  { time: '22:00', level: 35, activity: 'Bedtime' },
]

<BodyBattery
  energyLevels={energyLevels}
  currentLevel={35}
/>
```

**Energy Levels**:
- **75-100%**: High Energy 🔋 (Green)
- **50-74%**: Moderate Energy 🔌 (Yellow)
- **25-49%**: Low Energy ⚡ (Orange)
- **0-24%**: Recharge Needed 🪫 (Red)

**Tips System**:
- Low energy (<50%): Suggests rest, hydration, healthy snack
- High energy (≥50%): Suggests tackling challenging tasks or workouts

---

### 2. HabitGrid

GitHub-style contribution grid for tracking daily habit completion.

**Location**: `src/components/you/HabitGrid.tsx`

**Features**:
- 12-week habit calendar (configurable)
- 6 intensity levels (0%, <25%, <50%, <75%, <100%, 100%)
- Automatic streak calculation (current and best)
- Perfect days counter (100% completion)
- Month labels
- Day labels (Sun, Mon, Wed, Fri)
- Hover tooltips with completion details
- Click handling for day details
- Motivational messages based on streak

**Props**:
```typescript
export interface HabitDay {
  date: string              // YYYY-MM-DD
  completed: number         // 0-100 percentage
  habitsCompleted?: number  // Optional: number of habits completed
  totalHabits?: number      // Optional: total number of habits
}

export interface HabitGridProps {
  habitData: HabitDay[]
  weeks?: number            // Default: 12
  title?: string
  onDayClick?: (date: string) => void
}
```

**Usage Example**:
```tsx
const habitData: HabitDay[] = [
  {
    date: '2024-01-01',
    completed: 100,
    habitsCompleted: 5,
    totalHabits: 5,
  },
  {
    date: '2024-01-02',
    completed: 80,
    habitsCompleted: 4,
    totalHabits: 5,
  },
]

<HabitGrid
  habitData={habitData}
  weeks={12}
  onDayClick={(date) => console.log('Clicked:', date)}
/>
```

**Intensity Colors**:
- **0%**: Gray (#F3F4F6) - No completion
- **1-24%**: Light Green (#BBF7D0)
- **25-49%**: Medium Green (#86EFAC)
- **50-74%**: Green (#4ADE80)
- **75-99%**: Dark Green (#22C55E)
- **100%**: Darkest Green (#16A34A)

**Streak Calculation**:
- **Current Streak**: Consecutive days from today backwards with 100% completion
- **Best Streak**: Longest consecutive streak in dataset
- **Perfect Days**: Total number of 100% completion days

---

### 3. BiometricsChart

Multi-metric chart component for tracking various health measurements.

**Location**: `src/components/you/BiometricsChart.tsx`

**Features**:
- Multiple metric types (weight, body fat, muscle mass, waist, sleep, steps)
- Metric selector tabs
- SVG line chart with area fill
- Goal line indicator
- Data point hover tooltips
- Min/Max/Average statistics
- Change percentage from start
- Progress to goal display
- Contextual insights based on trend

**Props**:
```typescript
export type BiometricType = 'weight' | 'bodyFat' | 'muscleMass' | 'waist' | 'sleep' | 'steps'

export interface BiometricData {
  date: string
  value: number
}

export interface BiometricMetric {
  type: BiometricType
  label: string
  unit: string
  data: BiometricData[]
  goal?: number
  color: string
  icon: string
}

export interface BiometricsChartProps {
  metrics: BiometricMetric[]
  defaultMetric?: BiometricType
  title?: string
}
```

**Usage Example**:
```tsx
const metrics: BiometricMetric[] = [
  {
    type: 'weight',
    label: 'Weight',
    unit: 'kg',
    color: '#3B82F6',
    icon: '⚖️',
    goal: 75,
    data: [
      { date: 'Jan 1', value: 82 },
      { date: 'Jan 8', value: 81.2 },
      { date: 'Jan 15', value: 80.5 },
      { date: 'Feb 5', value: 78.5 },
    ],
  },
  {
    type: 'sleep',
    label: 'Sleep',
    unit: 'hours',
    color: '#8B5CF6',
    icon: '😴',
    goal: 8,
    data: [
      { date: 'Mon', value: 7.5 },
      { date: 'Tue', value: 7.2 },
      { date: 'Wed', value: 8.1 },
    ],
  },
]

<BiometricsChart
  metrics={metrics}
  defaultMetric="weight"
/>
```

**Recommended Colors**:
- **Weight**: Blue (#3B82F6) ⚖️
- **Body Fat**: Amber (#F59E0B) 📊
- **Muscle Mass**: Green (#10B981) 💪
- **Waist**: Orange (#FB923C) 📏
- **Sleep**: Purple (#8B5CF6) 😴
- **Steps**: Green (#10B981) 👟

**Insights**:
- Decrease: "Great progress! You've reduced..."
- Increase: "Your [metric] has increased... Keep monitoring!"
- Stable: "Your [metric] has remained stable."

---

### 4. SettingsForm

Comprehensive profile settings form with validation.

**Location**: `src/components/you/SettingsForm.tsx`

**Features**:
- Personal information section (name, email, age, gender)
- Body metrics section (height, current weight, goal weight)
- Automatic BMI calculation
- Activity level selection (5 levels)
- Multi-select goals (6 options)
- Notification preferences (4 types)
- Change tracking (Save button only active when changed)
- Reset functionality
- Form validation
- Loading states

**Props**:
```typescript
export interface UserSettings {
  name: string
  email: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number              // cm
  currentWeight: number       // kg
  goalWeight: number          // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goals: string[]
  notifications: {
    email: boolean
    push: boolean
    daily: boolean
    weekly: boolean
  }
}

export interface SettingsFormProps {
  initialSettings: UserSettings
  onSave: (settings: UserSettings) => void
  isLoading?: boolean
}
```

**Usage Example**:
```tsx
const initialSettings: UserSettings = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 28,
  gender: 'male',
  height: 178,
  currentWeight: 77.8,
  goalWeight: 75,
  activityLevel: 'moderate',
  goals: ['Lose weight', 'Improve fitness'],
  notifications: {
    email: true,
    push: true,
    daily: true,
    weekly: false,
  },
}

<SettingsForm
  initialSettings={initialSettings}
  onSave={(settings) => console.log('Save:', settings)}
  isLoading={false}
/>
```

**Activity Levels**:
- **Sedentary**: Little or no exercise
- **Light**: Exercise 1-3 days/week
- **Moderate**: Exercise 3-5 days/week
- **Active**: Exercise 6-7 days/week
- **Very Active**: Intense exercise daily

**Goal Options**:
- Lose weight
- Gain muscle
- Improve fitness
- Better sleep
- Reduce stress
- Build habits

**BMI Calculation**:
```
BMI = weight (kg) / (height (m))²
```
Automatically displayed below body metrics.

---

## Page Integration

### You Page Structure

**Location**: `src/app/(dashboard)/you/page.tsx`

Layout:
```
┌─────────────────────────────────────────┐
│ Page Header                             │
├────────────────────────────┬────────────┤
│ BodyBattery (1/2)          │ Biometrics │
│                            │ Chart (1/2)│
├────────────────────────────┤            │
│ HabitGrid (1/2)            │            │
│                            │            │
└────────────────────────────┴────────────┘
│ SettingsForm (Full Width)              │
└─────────────────────────────────────────┘
```

### State Management

```tsx
const [settings, setSettings] = useState<UserSettings>(mockUserSettings)
const [isSaving, setIsSaving] = useState(false)

const handleSaveSettings = async (newSettings: UserSettings) => {
  setIsSaving(true)
  // Call API
  await saveSettings(newSettings)
  setSettings(newSettings)
  setIsSaving(false)
  showToast({ type: 'success', title: 'Settings saved!' })
}

const handleDayClick = (date: string) => {
  // Show day details modal or navigate
  showToast({ type: 'info', title: `Viewing habits for ${date}` })
}
```

### Mock Data

Current implementation uses mock data:
- **mockEnergyLevels**: 11 data points from 6:00 to 22:00
- **mockHabitData**: 30 days with random completion rates
- **mockBiometrics**: 4 metrics (weight, bodyFat, sleep, steps)
- **mockUserSettings**: Complete user profile

All marked with `// TODO: Replace with API calls`

---

## API Integration (Future)

### Expected API Endpoints

1. **GET /api/v1/you/energy**
   ```typescript
   // Get today's energy levels
   Response: { energyLevels: EnergyLevel[], currentLevel: number }
   ```

2. **POST /api/v1/you/energy**
   ```typescript
   // Log energy level
   Body: { level: number, activity?: string }
   Response: { success: boolean }
   ```

3. **GET /api/v1/you/habits**
   ```typescript
   // Get habit data for date range
   Query: { startDate: string, endDate: string }
   Response: { habitData: HabitDay[] }
   ```

4. **GET /api/v1/you/biometrics**
   ```typescript
   // Get biometric data
   Query: { types: BiometricType[], days: number }
   Response: { metrics: BiometricMetric[] }
   ```

5. **POST /api/v1/you/biometrics**
   ```typescript
   // Log biometric measurement
   Body: { type: BiometricType, value: number, date: string }
   Response: { success: boolean }
   ```

6. **GET /api/v1/you/settings**
   ```typescript
   // Get user settings
   Response: { settings: UserSettings }
   ```

7. **PUT /api/v1/you/settings**
   ```typescript
   // Update user settings
   Body: UserSettings
   Response: { success: boolean, settings: UserSettings }
   ```

### Integration Example

```tsx
// Fetch energy data
useEffect(() => {
  async function fetchEnergyData() {
    try {
      const response = await fetch('/api/you/energy')
      const data = await response.json()
      setEnergyLevels(data.energyLevels)
      setCurrentLevel(data.currentLevel)
    } catch (error) {
      showToast({ type: 'error', title: 'Failed to load energy data' })
    }
  }

  fetchEnergyData()
}, [])

// Save settings
const handleSaveSettings = async (newSettings: UserSettings) => {
  setIsSaving(true)
  try {
    const response = await fetch('/api/you/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    })

    const data = await response.json()
    setSettings(data.settings)
    showToast({ type: 'success', title: 'Settings saved successfully!' })
  } catch (error) {
    showToast({ type: 'error', title: 'Failed to save settings' })
  } finally {
    setIsSaving(false)
  }
}
```

---

## Styling & Theming

### Color Scheme

**Energy Levels**:
- High (75-100%): Green (#22C55E)
- Moderate (50-74%): Yellow (#EAB308)
- Low (25-49%): Orange (#F97316)
- Critical (0-24%): Red (#EF4444)

**Habit Grid**:
- No completion: Gray (#F3F4F6)
- Partial completion: Green gradient (#BBF7D0 → #16A34A)
- Full completion: Darkest Green (#16A34A)

**Biometrics**:
- Custom per metric (see BiometricMetric colors above)

### Responsive Breakpoints

- **Mobile** (<1024px): Single column, stacked components
- **Desktop** (≥1024px): Two-column layout for charts, full width for settings

---

## Best Practices

1. **Energy Tracking**:
   - Log energy at consistent times daily
   - Include activity context when energy changes significantly
   - Aim for at least 5-6 data points per day

2. **Habit Tracking**:
   - Update habits daily for accurate streaks
   - Use percentage for partial completion (not just 0% or 100%)
   - Set realistic habit goals (3-5 habits to start)

3. **Biometric Logging**:
   - Weigh at same time each day (morning recommended)
   - Log measurements before large meals
   - Take measurements weekly, not daily (reduces noise)

4. **Settings**:
   - Update goals periodically as you progress
   - Adjust activity level when routine changes
   - Review notification preferences monthly

5. **Performance**:
   - Limit habit grid to 12-16 weeks max
   - Use virtualization for large datasets
   - Cache biometric data locally
   - Debounce settings autosave

---

## Interactive Features

### BodyBattery Interactions

1. **Hover on data points**: Shows exact time, level, and activity
2. **Energy tips**: Dynamic suggestions based on current level
3. **Color transitions**: Smooth gradient as battery level changes

### HabitGrid Interactions

1. **Click on day**: View detailed habit breakdown
2. **Hover tooltips**: Shows date, percentage, and fraction (X/Y habits)
3. **Streak motivation**: Displays encouraging messages

### BiometricsChart Interactions

1. **Metric switching**: Click tabs to change displayed metric
2. **Data point hover**: Shows exact date and value
3. **Goal line**: Visual indicator of target
4. **Insights**: Automatic trend analysis

### SettingsForm Interactions

1. **Change tracking**: Save button only enabled when modified
2. **BMI calculation**: Updates in real-time as weight/height change
3. **Goal selection**: Multi-select tags
4. **Reset**: Reverts all changes to initial state

---

## Component Checklist

- [x] BodyBattery.tsx - Energy visualization
- [x] HabitGrid.tsx - Habit calendar grid
- [x] BiometricsChart.tsx - Multi-metric charts
- [x] SettingsForm.tsx - Profile settings form
- [x] index.ts - Component exports
- [x] you/page.tsx - Integrated page with mock data
- [ ] API integration (Phase 3)
- [ ] Day detail modal for HabitGrid
- [ ] Biometric logging form
- [ ] Data export functionality

---

## Testing the You Page

1. **Start the development server**:
   ```bash
   cd apps/web
   npm run dev
   ```

2. **Navigate to You page**:
   ```
   http://localhost:3000/you
   ```

3. **Test interactions**:
   - **BodyBattery**: Hover over energy chart points
   - **HabitGrid**: Click on different days, observe streak calculation
   - **BiometricsChart**: Switch between metrics (Weight, Body Fat, Sleep, Steps)
   - **SettingsForm**: Modify settings, click Save, then Reset

4. **Verify components**:
   - ✅ BodyBattery displays energy timeline with colors
   - ✅ HabitGrid shows 12 weeks with intensity colors
   - ✅ BiometricsChart displays all 4 metrics
   - ✅ SettingsForm has all sections functional
   - ✅ BMI calculation updates correctly
   - ✅ Save/Reset buttons work properly

---

## Troubleshooting

### Energy Chart Not Displaying

**Issue**: SVG chart appears blank
**Fix**: Ensure `energyLevels` array has at least 2 data points

### Habit Grid Misaligned

**Issue**: Days don't align with month labels
**Fix**: Check date format is YYYY-MM-DD and dates are consecutive

### Biometrics Goal Line Not Showing

**Issue**: Goal line not visible
**Fix**: Ensure `goal` value is within min-max range of data

### Settings Not Saving

**Issue**: Changes lost after Save
**Fix**: Check that `onSave` callback properly updates state

### BMI Shows NaN

**Issue**: BMI calculation fails
**Fix**: Ensure height > 0 and weight > 0

---

## Advanced Features (Future)

1. **Energy Prediction**: AI predicts energy levels based on sleep/activity
2. **Habit Suggestions**: AI recommends habits based on goals
3. **Biometric Trends**: Multi-month trend analysis with ML
4. **Settings Sync**: Cloud backup and multi-device sync
5. **Export Data**: Download CSV/PDF reports
6. **Wearable Integration**: Sync with Fitbit, Apple Watch, etc.
7. **Social Comparison**: Compare metrics with similar users (anonymized)
8. **Habit Reminders**: Push notifications for uncompleted habits
9. **Goal Milestones**: Celebrate achievements (e.g., "50% to goal!")
10. **Custom Metrics**: Allow users to track custom biometrics

---

## Resources

- [SVG Line Charts Tutorial](https://css-tricks.com/how-to-make-charts-with-svg/)
- [GitHub Contribution Graph](https://github.blog/2013-01-07-introducing-contributions/)
- [BMI Calculator](https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html)
- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Project architecture
- [FOCUS_COMPONENTS_GUIDE.md](./FOCUS_COMPONENTS_GUIDE.md) - Focus components
- [JOURNEY_COMPONENTS_GUIDE.md](./JOURNEY_COMPONENTS_GUIDE.md) - Journey components
- [COACH_COMPONENTS_GUIDE.md](./COACH_COMPONENTS_GUIDE.md) - Coach components

---

**Last Updated**: Phase 2 - UI Components (Week 1)
**Status**: ✅ Complete
**Next Phase**: Tribe (Community) Components
