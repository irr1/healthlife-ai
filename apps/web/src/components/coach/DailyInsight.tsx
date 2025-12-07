import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export type InsightType = 'tip' | 'warning' | 'achievement' | 'suggestion'

export interface Insight {
  id: string
  type: InsightType
  title: string
  message: string
  date: string
  isNew?: boolean
}

export interface DailyInsightProps {
  insight: Insight
  onDismiss?: () => void
  onViewMore?: () => void
}

const insightConfig = {
  tip: {
    icon: '💡',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    badgeColor: 'bg-blue-500',
  },
  warning: {
    icon: '⚠️',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    badgeColor: 'bg-yellow-500',
  },
  achievement: {
    icon: '🏆',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    badgeColor: 'bg-green-500',
  },
  suggestion: {
    icon: '✨',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    badgeColor: 'bg-purple-500',
  },
}

export default function DailyInsight({ insight, onDismiss, onViewMore }: DailyInsightProps) {
  const config = insightConfig[insight.type]

  return (
    <Card
      variant="outlined"
      className={cn(
        'border-2 relative overflow-hidden',
        config.bgColor,
        config.borderColor
      )}
    >
      {/* New Badge */}
      {insight.isNew && (
        <div className="absolute top-0 right-0">
          <div className={cn('text-white text-xs font-bold px-3 py-1 rounded-bl-lg', config.badgeColor)}>
            NEW
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-5xl flex-shrink-0">{config.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn('text-lg font-bold', config.textColor)}>
                {insight.title}
              </h3>
            </div>
            <p className="text-xs text-gray-500">{insight.date}</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-700 leading-relaxed mb-4">
          {insight.message}
        </p>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {onViewMore && (
            <Button variant="primary" size="sm" onClick={onViewMore}>
              Learn More
            </Button>
          )}
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 right-0 opacity-10 text-9xl -mb-8 -mr-8 pointer-events-none">
          {config.icon}
        </div>
      </div>
    </Card>
  )
}

// Multi-Insight Display Component
export interface DailyInsightsListProps {
  insights: Insight[]
  onDismiss?: (insightId: string) => void
  onViewMore?: (insightId: string) => void
  maxDisplay?: number
}

export function DailyInsightsList({
  insights,
  onDismiss,
  onViewMore,
  maxDisplay = 3,
}: DailyInsightsListProps) {
  const displayInsights = insights.slice(0, maxDisplay)

  if (insights.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          No insights yet
        </h3>
        <p className="text-gray-600">
          Check back later for personalized AI insights
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {displayInsights.map((insight) => (
        <DailyInsight
          key={insight.id}
          insight={insight}
          onDismiss={onDismiss ? () => onDismiss(insight.id) : undefined}
          onViewMore={onViewMore ? () => onViewMore(insight.id) : undefined}
        />
      ))}

      {insights.length > maxDisplay && (
        <Card className="text-center py-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            +{insights.length - maxDisplay} more insights available
          </p>
        </Card>
      )}
    </div>
  )
}
