'use client'

import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

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

export default function WeeklyReview({
  week,
  stats,
  isCurrentWeek = false,
  onGenerateNextWeek,
  onViewDetails,
}: WeeklyReviewProps) {
  const completionPercentage = Math.round((stats.tasksCompleted / stats.totalTasks) * 100)

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Week {week} Review</CardTitle>
        <CardDescription>
          {isCurrentWeek ? 'Current week in progress' : 'Weekly performance summary'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Completion Stats */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Task Completion</span>
            <span className="text-2xl font-bold text-gray-900">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
            <div
              className={cn(
                'h-3 rounded-full transition-all duration-500',
                completionPercentage >= 80
                  ? 'bg-green-500'
                  : completionPercentage >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              )}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">
            {stats.tasksCompleted} of {stats.totalTasks} tasks completed
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatBox
            label="Completion Rate"
            value={`${stats.completionRate}%`}
            icon="📊"
            color="bg-blue-50"
          />
          <StatBox
            label="Current Streak"
            value={`${stats.streak} days`}
            icon="🔥"
            color="bg-orange-50"
          />
        </div>

        {/* Top Habits */}
        {stats.topHabits.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">🌟 Top Habits</h4>
            <div className="space-y-1">
              {stats.topHabits.map((habit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700 bg-green-50 px-3 py-2 rounded"
                >
                  <span className="font-bold text-green-600">✓</span>
                  <span>{habit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {stats.improvements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">💪 Areas to Improve</h4>
            <div className="space-y-1">
              {stats.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-700 bg-yellow-50 px-3 py-2 rounded"
                >
                  <span className="text-yellow-600">→</span>
                  <span>{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Badge */}
        <div className="flex justify-center">
          {completionPercentage >= 80 && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              🏆 Excellent Week!
            </div>
          )}
          {completionPercentage >= 50 && completionPercentage < 80 && (
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              ✨ Good Progress!
            </div>
          )}
          {completionPercentage < 50 && (
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              💙 Keep Going!
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        {onViewDetails && (
          <Button variant="ghost" onClick={onViewDetails} className="w-full">
            View Detailed Report
          </Button>
        )}

        {!isCurrentWeek && onGenerateNextWeek && (
          <Button onClick={onGenerateNextWeek} className="w-full">
            Generate Next Week Plan
          </Button>
        )}

        {isCurrentWeek && (
          <div className="text-center w-full">
            <p className="text-sm text-gray-600">
              ⏰ Week ends in {7 - new Date().getDay()} days
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

interface StatBoxProps {
  label: string
  value: string
  icon: string
  color: string
}

function StatBox({ label, value, icon, color }: StatBoxProps) {
  return (
    <div className={cn('p-4 rounded-lg', color)}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  )
}
