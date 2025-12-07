import Card, { CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface Milestone {
  id: string
  title: string
  description?: string
  target: string // e.g., "-2 kg", "7 days streak"
  current?: string // current progress
  isCompleted: boolean
  icon?: string
  category?: 'weight' | 'habit' | 'workout' | 'nutrition' | 'other'
  deadline?: string
}

export interface MilestoneCardProps {
  milestones: Milestone[]
  title?: string
}

const categoryConfig = {
  weight: { color: 'bg-blue-100 text-blue-700 border-blue-300', emoji: '⚖️' },
  habit: { color: 'bg-green-100 text-green-700 border-green-300', emoji: '✅' },
  workout: { color: 'bg-orange-100 text-orange-700 border-orange-300', emoji: '💪' },
  nutrition: { color: 'bg-purple-100 text-purple-700 border-purple-300', emoji: '🥗' },
  other: { color: 'bg-gray-100 text-gray-700 border-gray-300', emoji: '🎯' },
}

export default function MilestoneCard({ milestones, title = 'Milestones' }: MilestoneCardProps) {
  const upcomingMilestones = milestones.filter((m) => !m.isCompleted)
  const completedMilestones = milestones.filter((m) => m.isCompleted)

  return (
    <Card>
      <CardContent padding="md">
        <h3 className="text-xl font-bold mb-4">{title}</h3>

        {/* Upcoming Milestones */}
        {upcomingMilestones.length > 0 && (
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-gray-600">Upcoming</p>
            {upcomingMilestones.map((milestone) => (
              <MilestoneItem key={milestone.id} milestone={milestone} />
            ))}
          </div>
        )}

        {/* Completed Milestones */}
        {completedMilestones.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            {completedMilestones.map((milestone) => (
              <MilestoneItem key={milestone.id} milestone={milestone} />
            ))}
          </div>
        )}

        {milestones.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No milestones set yet</p>
            <p className="text-sm mt-1">Complete your first week to unlock milestones!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface MilestoneItemProps {
  milestone: Milestone
}

function MilestoneItem({ milestone }: MilestoneItemProps) {
  const category = milestone.category || 'other'
  const config = categoryConfig[category]
  const emoji = milestone.icon || config.emoji

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all',
        config.color,
        milestone.isCompleted ? 'opacity-70' : 'hover:shadow-md'
      )}
    >
      {/* Icon */}
      <div className="text-2xl flex-shrink-0">
        {milestone.isCompleted ? '🏆' : emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className={cn('font-medium', milestone.isCompleted && 'line-through')}>
            {milestone.title}
          </p>
          {milestone.isCompleted && (
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
              Done
            </span>
          )}
        </div>

        {milestone.description && (
          <p className="text-sm opacity-80 mb-2">{milestone.description}</p>
        )}

        {/* Target & Progress */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">{milestone.target}</span>
          {milestone.current && !milestone.isCompleted && (
            <span className="text-xs opacity-70">(current: {milestone.current})</span>
          )}
        </div>

        {/* Deadline */}
        {milestone.deadline && !milestone.isCompleted && (
          <p className="text-xs opacity-70 mt-1">⏰ {milestone.deadline}</p>
        )}
      </div>

      {/* Checkmark */}
      {milestone.isCompleted && (
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
