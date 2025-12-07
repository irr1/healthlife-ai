import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export interface TodayFocusProps {
  goal: string
  description?: string
  progress?: number // 0-100
  onComplete?: () => void
  isCompleted?: boolean
}

export default function TodayFocus({
  goal,
  description,
  progress = 0,
  onComplete,
  isCompleted = false,
}: TodayFocusProps) {
  return (
    <Card
      variant="elevated"
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none"
    >
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">Today&apos;s Focus</p>
            <h2 className="text-3xl font-bold leading-tight">{goal}</h2>
            {description && (
              <p className="mt-2 text-sm opacity-80">{description}</p>
            )}
          </div>

          {isCompleted && (
            <div className="bg-white/20 rounded-full p-3">
              <svg
                className="h-8 w-8"
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
          )}
        </div>

        {/* Progress Bar */}
        {!isCompleted && progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Progress</span>
              <span className="text-sm font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isCompleted && onComplete && (
          <Button
            variant="secondary"
            onClick={onComplete}
            className="mt-4 bg-white text-blue-600 hover:bg-gray-100"
          >
            Mark as Complete
          </Button>
        )}

        {isCompleted && (
          <div className="mt-4 flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 w-fit">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Completed!</span>
          </div>
        )}
      </div>
    </Card>
  )
}
