import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export interface WhyBlockProps {
  reason: string
  goal?: string
  dateStarted?: string
  onEdit?: () => void
}

export default function WhyBlock({ reason, goal, dateStarted, onEdit }: WhyBlockProps) {
  return (
    <Card variant="elevated" className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-none">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold opacity-90 mb-1">Your &quot;Why&quot;</h3>
            <p className="text-sm opacity-80">Remember why you started</p>
          </div>
          <div className="text-4xl">💫</div>
        </div>

        {/* Main Reason */}
        <div className="bg-white/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
          <p className="text-lg leading-relaxed italic">
            &quot;{reason}&quot;
          </p>
        </div>

        {/* Goal */}
        {goal && (
          <div className="mb-4">
            <p className="text-sm opacity-90 mb-1">Your Goal:</p>
            <p className="font-semibold text-lg">{goal}</p>
          </div>
        )}

        {/* Date Started */}
        {dateStarted && (
          <div className="mb-4">
            <p className="text-sm opacity-90">
              Started on: <span className="font-medium">{dateStarted}</span>
            </p>
          </div>
        )}

        {/* Motivational Quote */}
        <div className="border-t border-white/30 pt-4 mb-4">
          <p className="text-sm opacity-90 italic">
            💪 &quot;The only bad workout is the one that didn&apos;t happen&quot;
          </p>
        </div>

        {/* Edit Button */}
        {onEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            className="bg-white/20 hover:bg-white/30 text-white border-white/40"
          >
            Update Your Why
          </Button>
        )}
      </div>
    </Card>
  )
}
