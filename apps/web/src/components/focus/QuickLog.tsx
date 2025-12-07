'use client'

import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export interface QuickAction {
  id: string
  label: string
  emoji: string
  color: string
  value?: number // для количественных действий (стаканы воды, калории)
  unit?: string // единица измерения
}

export interface QuickLogProps {
  actions?: QuickAction[]
  onLog?: (actionId: string, value?: number) => void
}

const defaultActions: QuickAction[] = [
  { id: 'water', label: 'Water', emoji: '💧', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200', unit: 'glass' },
  { id: 'meal', label: 'Meal', emoji: '🍽️', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { id: 'workout', label: 'Workout', emoji: '💪', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200', unit: 'min' },
  { id: 'walk', label: 'Walk', emoji: '🚶', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200', unit: 'steps' },
  { id: 'sleep', label: 'Sleep', emoji: '😴', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200', unit: 'hrs' },
  { id: 'meditation', label: 'Meditate', emoji: '🧘', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200', unit: 'min' },
]

export default function QuickLog({ actions = defaultActions, onLog }: QuickLogProps) {
  const { showToast } = useToast()

  const handleLog = (action: QuickAction) => {
    onLog?.(action.id)

    showToast({
      type: 'success',
      title: 'Logged!',
      message: `${action.emoji} ${action.label} logged successfully`,
      duration: 2000,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Logging</CardTitle>
        <CardDescription>
          Tap to quickly log your daily activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {actions.map((action) => (
            <QuickActionButton
              key={action.id}
              action={action}
              onClick={() => handleLog(action)}
            />
          ))}
        </div>

        {/* Recently Logged */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
          <div className="space-y-2">
            <ActivityItem emoji="💧" label="Water" time="5 min ago" />
            <ActivityItem emoji="🍽️" label="Breakfast" time="2 hrs ago" />
            <ActivityItem emoji="💪" label="Workout" time="3 hrs ago" count="30 min" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickActionButtonProps {
  action: QuickAction
  onClick: () => void
}

function QuickActionButton({ action, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center p-4 rounded-lg font-medium transition-all hover:scale-105 active:scale-95',
        action.color
      )}
    >
      <span className="text-3xl mb-1">{action.emoji}</span>
      <span className="text-sm">{action.label}</span>
      {action.unit && (
        <span className="text-xs opacity-70 mt-1">+1 {action.unit}</span>
      )}
    </button>
  )
}

interface ActivityItemProps {
  emoji: string
  label: string
  time: string
  count?: string
}

function ActivityItem({ emoji, label, time, count }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      {count && (
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {count}
        </span>
      )}
    </div>
  )
}
