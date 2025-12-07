'use client'

import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export type PhaseStatus = 'completed' | 'current' | 'locked'

export interface Phase {
  id: string
  title: string
  description: string
  status: PhaseStatus
  progress?: number // 0-100, only for current phase
  startDate?: string
  endDate?: string
}

export interface RoadmapVisualizerProps {
  phases: Phase[]
  onPhaseClick?: (phaseId: string) => void
}

export default function RoadmapVisualizer({ phases, onPhaseClick }: RoadmapVisualizerProps) {
  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Your Journey</h2>

        <div className="space-y-4">
          {phases.map((phase, index) => (
            <PhaseItem
              key={phase.id}
              phase={phase}
              index={index}
              isLast={index === phases.length - 1}
              onClick={() => onPhaseClick?.(phase.id)}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}

interface PhaseItemProps {
  phase: Phase
  index: number
  isLast: boolean
  onClick: () => void
}

function PhaseItem({ phase, index, isLast, onClick }: PhaseItemProps) {
  const statusConfig = {
    completed: {
      icon: '✅',
      bg: 'bg-green-100',
      border: 'border-green-500',
      text: 'text-green-700',
      badgeColor: 'bg-green-500',
    },
    current: {
      icon: '🎯',
      bg: 'bg-blue-100',
      border: 'border-blue-500',
      text: 'text-blue-700',
      badgeColor: 'bg-blue-500',
    },
    locked: {
      icon: '🔒',
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-500',
      badgeColor: 'bg-gray-400',
    },
  }

  const config = statusConfig[phase.status]

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={phase.status === 'locked'}
        className={cn(
          'w-full text-left border-2 rounded-lg p-4 transition-all',
          config.border,
          config.bg,
          phase.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
        )}
      >
        <div className="flex items-start gap-4">
          {/* Phase Number Badge */}
          <div
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg',
              config.badgeColor
            )}
          >
            {index + 1}
          </div>

          {/* Phase Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{config.icon}</span>
              <h3 className={cn('font-bold text-lg', config.text)}>
                {phase.title}
              </h3>
              {phase.status === 'current' && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                  Current
                </span>
              )}
            </div>
            <p className="text-gray-700 text-sm mb-2">{phase.description}</p>

            {/* Progress Bar (only for current phase) */}
            {phase.status === 'current' && phase.progress !== undefined && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">Progress</span>
                  <span className="text-xs font-bold text-blue-600">{phase.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Dates */}
            {phase.startDate && (
              <div className="mt-2 text-xs text-gray-500">
                {phase.status === 'completed' && phase.endDate && (
                  <span>Completed: {phase.endDate}</span>
                )}
                {phase.status === 'current' && (
                  <span>Started: {phase.startDate}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Connector Line */}
      {!isLast && (
        <div className="flex justify-center py-2">
          <div
            className={cn(
              'w-1 h-8',
              phase.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
            )}
          />
        </div>
      )}
    </div>
  )
}
