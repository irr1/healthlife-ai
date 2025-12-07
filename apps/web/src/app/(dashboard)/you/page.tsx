'use client'

import { useState } from 'react'
import {
  BodyBattery,
  HabitGrid,
  BiometricsChart,
  SettingsForm,
  type EnergyLevel,
  type HabitDay,
  type BiometricMetric,
  type UserSettings,
} from '@/components/you'
import { useToast } from '@/components/ui/Toast'

// TODO: Replace with API calls
const mockEnergyLevels: EnergyLevel[] = [
  { time: '6:00', level: 45, activity: 'Woke up' },
  { time: '7:00', level: 55 },
  { time: '8:00', level: 70, activity: 'Morning workout' },
  { time: '9:00', level: 85 },
  { time: '10:00', level: 90 },
  { time: '12:00', level: 80, activity: 'Lunch' },
  { time: '14:00', level: 75 },
  { time: '16:00', level: 65 },
  { time: '18:00', level: 60, activity: 'Evening walk' },
  { time: '20:00', level: 50 },
  { time: '22:00', level: 35, activity: 'Bedtime' },
]

// Generate mock habit data with deterministic values to avoid hydration issues
const mockHabitData: HabitDay[] = (() => {
  // Use a fixed base date to ensure consistent server/client rendering
  const baseDate = new Date('2024-02-12')
  // Predefined completion pattern (deterministic, not random)
  const completionPattern = [
    0, 0, 0, 0, 0, // First 5 days: 0%
    100, 80, 90, 100, 75, // Next 5: varying
    100, 100, 60, 85, 100, // Next 5: varying
    70, 100, 90, 100, 65, // Next 5: varying
    100, 80, 100, 90, 100, // Next 5: varying
    75, 100, 85, 100, 90, // Last 5: varying
  ]

  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(baseDate)
    date.setDate(baseDate.getDate() - (29 - i))
    const completed = completionPattern[i]
    return {
      date: date.toISOString().split('T')[0],
      completed,
      habitsCompleted: Math.floor((completed / 100) * 5),
      totalHabits: 5,
    }
  })
})()

const mockBiometrics: BiometricMetric[] = [
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
      { date: 'Jan 22', value: 79.8 },
      { date: 'Jan 29', value: 79.0 },
      { date: 'Feb 5', value: 78.5 },
      { date: 'Feb 12', value: 77.8 },
    ],
  },
  {
    type: 'bodyFat',
    label: 'Body Fat',
    unit: '%',
    color: '#F59E0B',
    icon: '📊',
    goal: 15,
    data: [
      { date: 'Jan 1', value: 22 },
      { date: 'Jan 8', value: 21.5 },
      { date: 'Jan 15', value: 21 },
      { date: 'Jan 22', value: 20.5 },
      { date: 'Jan 29', value: 20 },
      { date: 'Feb 5', value: 19.5 },
      { date: 'Feb 12', value: 19 },
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
      { date: 'Thu', value: 7.8 },
      { date: 'Fri', value: 6.5 },
      { date: 'Sat', value: 8.5 },
      { date: 'Sun', value: 8.2 },
    ],
  },
  {
    type: 'steps',
    label: 'Steps',
    unit: 'k',
    color: '#10B981',
    icon: '👟',
    goal: 10,
    data: [
      { date: 'Mon', value: 8.5 },
      { date: 'Tue', value: 10.2 },
      { date: 'Wed', value: 9.1 },
      { date: 'Thu', value: 11.8 },
      { date: 'Fri', value: 7.5 },
      { date: 'Sat', value: 12.5 },
      { date: 'Sun', value: 9.2 },
    ],
  },
]

const mockUserSettings: UserSettings = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 28,
  gender: 'male',
  height: 178,
  currentWeight: 77.8,
  goalWeight: 75,
  activityLevel: 'moderate',
  goals: ['Lose weight', 'Improve fitness', 'Build habits'],
  notifications: {
    email: true,
    push: true,
    daily: true,
    weekly: false,
  },
}

export default function YouPage() {
  const [settings, setSettings] = useState<UserSettings>(mockUserSettings)
  const [isSaving, setIsSaving] = useState(false)
  const { showToast } = useToast()

  const handleSaveSettings = async (newSettings: UserSettings) => {
    setIsSaving(true)

    // TODO: Replace with API call
    setTimeout(() => {
      setSettings(newSettings)
      setIsSaving(false)
      showToast({ type: 'success', title: 'Settings saved successfully!' })
    }, 1000)
  }

  const handleDayClick = (date: string) => {
    showToast({ type: 'info', title: `Viewing habits for ${date}` })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600">Track your progress and manage your settings</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Body Battery */}
          <BodyBattery
            energyLevels={mockEnergyLevels}
            currentLevel={mockEnergyLevels[mockEnergyLevels.length - 1].level}
          />

          {/* Habit Grid */}
          <HabitGrid
            habitData={mockHabitData}
            weeks={12}
            onDayClick={handleDayClick}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Biometrics Chart */}
          <BiometricsChart
            metrics={mockBiometrics}
            defaultMetric="weight"
          />
        </div>
      </div>

      {/* Settings Form - Full Width */}
      <div>
        <SettingsForm
          initialSettings={settings}
          onSave={handleSaveSettings}
          isLoading={isSaving}
        />
      </div>
    </div>
  )
}
