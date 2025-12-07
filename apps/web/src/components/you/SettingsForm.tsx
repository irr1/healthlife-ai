'use client'

import { useState } from 'react'
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export interface UserSettings {
  name: string
  email: string
  age: number
  gender: 'male' | 'female' | 'other'
  height: number // cm
  currentWeight: number // kg
  goalWeight: number // kg
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

export default function SettingsForm({
  initialSettings,
  onSave,
  isLoading = false,
}: SettingsFormProps) {
  const [settings, setSettings] = useState<UserSettings>(initialSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field: keyof UserSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleNotificationChange = (field: keyof UserSettings['notifications'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }))
    setHasChanges(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(settings)
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings(initialSettings)
    setHasChanges(false)
  }

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Light (exercise 1-3 days/week)' },
    { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
    { value: 'active', label: 'Active (exercise 6-7 days/week)' },
    { value: 'very_active', label: 'Very Active (intense exercise daily)' },
  ]

  const goalOptions = [
    'Lose weight',
    'Gain muscle',
    'Improve fitness',
    'Better sleep',
    'Reduce stress',
    'Build habits',
  ]

  const handleGoalToggle = (goal: string) => {
    setSettings((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }))
    setHasChanges(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Manage your personal information and preferences
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>
          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>

            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={settings.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />

              <Input
                label="Email"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  value={settings.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value))}
                  min={13}
                  max={120}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={settings.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Body Metrics */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Body Metrics
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Height (cm)"
                type="number"
                value={settings.height}
                onChange={(e) => handleChange('height', parseInt(e.target.value))}
                min={100}
                max={250}
                required
              />

              <Input
                label="Current Weight (kg)"
                type="number"
                value={settings.currentWeight}
                onChange={(e) => handleChange('currentWeight', parseFloat(e.target.value))}
                min={30}
                max={300}
                step={0.1}
                required
              />

              <Input
                label="Goal Weight (kg)"
                type="number"
                value={settings.goalWeight}
                onChange={(e) => handleChange('goalWeight', parseFloat(e.target.value))}
                min={30}
                max={300}
                step={0.1}
                required
              />
            </div>

            {/* BMI Display */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">BMI:</span>{' '}
                {(
                  settings.currentWeight /
                  Math.pow(settings.height / 100, 2)
                ).toFixed(1)}{' '}
                | <span className="font-semibold">Goal BMI:</span>{' '}
                {(settings.goalWeight / Math.pow(settings.height / 100, 2)).toFixed(1)}
              </p>
            </div>
          </div>

          {/* Activity Level */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Level
            </h3>

            <div className="space-y-2">
              {activityLevels.map((level) => (
                <label
                  key={level.value}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="activityLevel"
                    value={level.value}
                    checked={settings.activityLevel === level.value}
                    onChange={(e) => handleChange('activityLevel', e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-900">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Goals
            </h3>

            <div className="flex flex-wrap gap-2">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleGoalToggle(goal)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    settings.goals.includes(goal)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {settings.goals.includes(goal) && '✓ '}
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Preferences
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-900">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-900">Push Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-900">Daily Reminders</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.daily}
                  onChange={(e) => handleNotificationChange('daily', e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-900">Weekly Progress Reports</span>
                <input
                  type="checkbox"
                  checked={settings.notifications.weekly}
                  onChange={(e) => handleNotificationChange('weekly', e.target.checked)}
                  className="w-5 h-5 text-blue-600"
                />
              </label>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={!hasChanges || isLoading}
            isLoading={isLoading}
            className="flex-1"
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={!hasChanges || isLoading}
          >
            Reset
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
