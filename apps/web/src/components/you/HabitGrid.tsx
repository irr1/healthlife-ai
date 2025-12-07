'use client'

import { useState, useEffect } from 'react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface HabitDay {
  date: string // YYYY-MM-DD
  completed: number // 0-100 percentage of habits completed
  habitsCompleted?: number
  totalHabits?: number
}

export interface HabitGridProps {
  habitData: HabitDay[]
  weeks?: number // Number of weeks to display (default: 12)
  title?: string
  onDayClick?: (date: string) => void
}

export default function HabitGrid({
  habitData,
  weeks = 12,
  title = 'Habit Streak',
  onDayClick,
}: HabitGridProps) {
  // Generate grid of days
  const generateGrid = () => {
    const today = new Date()
    const totalDays = weeks * 7
    const grid: HabitDay[][] = []

    // Start from X weeks ago
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - totalDays)

    // Adjust to start from Sunday
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - dayOfWeek)

    let currentWeek: HabitDay[] = []

    for (let i = 0; i < totalDays + dayOfWeek; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const dateString = date.toISOString().split('T')[0]
      const dayData = habitData.find((d) => d.date === dateString)

      currentWeek.push(
        dayData || {
          date: dateString,
          completed: 0,
        }
      )

      if ((i + 1) % 7 === 0) {
        grid.push(currentWeek)
        currentWeek = []
      }
    }

    if (currentWeek.length > 0) {
      grid.push(currentWeek)
    }

    return grid
  }

  const grid = generateGrid()

  const getIntensityColor = (completed: number): string => {
    if (completed === 0) return 'bg-gray-100'
    if (completed < 25) return 'bg-green-200'
    if (completed < 50) return 'bg-green-300'
    if (completed < 75) return 'bg-green-400'
    if (completed < 100) return 'bg-green-500'
    return 'bg-green-600'
  }

  const getDayName = (index: number): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[index]
  }

  const getMonthLabel = (weekIndex: number) => {
    if (weekIndex === 0 || weekIndex % 4 === 0) {
      const firstDay = grid[weekIndex]?.[0]
      if (firstDay) {
        const date = new Date(firstDay.date)
        return date.toLocaleDateString('en-US', { month: 'short' })
      }
    }
    return null
  }

  // Calculate stats
  const totalDays = habitData.length
  const completedDays = habitData.filter((d) => d.completed === 100).length

  // Use client-side only state to avoid hydration issues with date calculations
  const [currentStreak, setCurrentStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  useEffect(() => {
    setCurrentStreak(calculateStreak(habitData))
    setBestStreak(calculateBestStreak(habitData))
  }, [habitData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Track your daily habit completion
        </p>
      </CardHeader>

      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{currentStreak}</p>
            <p className="text-xs text-gray-600">Current Streak</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{bestStreak}</p>
            <p className="text-xs text-gray-600">Best Streak</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{completedDays}</p>
            <p className="text-xs text-gray-600">Perfect Days</p>
          </div>
        </div>

        {/* Habit Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex gap-1 mb-2 ml-8">
              {grid.map((week, weekIndex) => {
                const monthLabel = getMonthLabel(weekIndex)
                return (
                  <div key={weekIndex} className="w-3 text-xs text-gray-600">
                    {monthLabel}
                  </div>
                )
              })}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 pr-2">
                {[1, 3, 5].map((dayIndex) => (
                  <div key={dayIndex} className="h-3 text-xs text-gray-600 leading-3">
                    {getDayName(dayIndex)}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              <div className="flex gap-1">
                {grid.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <button
                        key={`${weekIndex}-${dayIndex}`}
                        onClick={() => onDayClick?.(day.date)}
                        className={cn(
                          'w-3 h-3 rounded-sm transition-all hover:ring-2 hover:ring-blue-400',
                          getIntensityColor(day.completed)
                        )}
                        title={`${day.date}: ${day.completed}% completed${
                          day.habitsCompleted
                            ? ` (${day.habitsCompleted}/${day.totalHabits})`
                            : ''
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-600">Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm" />
            <div className="w-3 h-3 bg-green-200 rounded-sm" />
            <div className="w-3 h-3 bg-green-300 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 rounded-sm" />
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
            <div className="w-3 h-3 bg-green-600 rounded-sm" />
          </div>
          <span className="text-xs text-gray-600">More</span>
        </div>

        {/* Motivational Message */}
        {currentStreak > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-semibold">🔥 Keep it up!</span>{' '}
              {currentStreak >= 7
                ? `Amazing ${currentStreak}-day streak! You're building unstoppable momentum.`
                : `You're on a ${currentStreak}-day streak. ${7 - currentStreak} more days to hit a week!`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Helper function to calculate current streak
function calculateStreak(habitData: HabitDay[]): number {
  const sortedData = [...habitData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  let streak = 0
  // Use local date string to avoid timezone issues
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const todayString = `${year}-${month}-${day}`

  for (const day of sortedData) {
    if (day.date > todayString) continue // Skip future dates

    if (day.completed === 100) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Helper function to calculate best streak
function calculateBestStreak(habitData: HabitDay[]): number {
  const sortedData = [...habitData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  let bestStreak = 0
  let currentStreak = 0

  for (const day of sortedData) {
    if (day.completed === 100) {
      currentStreak++
      bestStreak = Math.max(bestStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  return bestStreak
}
