'use client'

import { useState } from 'react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export type ChallengeStatus = 'active' | 'upcoming' | 'completed'
export type ChallengeType = 'daily' | 'weekly' | 'monthly'

export interface Challenge {
  id: string
  title: string
  description: string
  type: ChallengeType
  status: ChallengeStatus
  participants: number
  maxParticipants?: number
  reward: number // points
  progress?: number // 0-100
  startDate: string
  endDate: string
  icon?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface ChallengeListProps {
  challenges: Challenge[]
  onJoinChallenge?: (challengeId: string) => void
  onViewChallenge?: (challengeId: string) => void
  title?: string
}

// Helper functions moved outside component
const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-700 border-green-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    case 'hard':
      return 'bg-red-100 text-red-700 border-red-300'
  }
}

const getTypeIcon = (type: ChallengeType) => {
  switch (type) {
    case 'daily':
      return '📅'
    case 'weekly':
      return '📆'
    case 'monthly':
      return '🗓️'
  }
}

export default function ChallengeList({
  challenges,
  onJoinChallenge,
  onViewChallenge,
  title = 'Community Challenges',
}: ChallengeListProps) {
  const [filter, setFilter] = useState<ChallengeStatus | 'all'>('all')

  const filteredChallenges = challenges.filter((challenge) =>
    filter === 'all' ? true : challenge.status === filter
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Join challenges and compete with the community
        </p>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'active', 'upcoming', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                filter === status
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Challenges */}
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h4 className="text-lg font-bold text-gray-700 mb-2">No challenges found</h4>
            <p className="text-gray-600">Check back later for new challenges!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChallenges.map((challenge) => (
              <ChallengeItem
                key={challenge.id}
                challenge={challenge}
                onJoin={() => onJoinChallenge?.(challenge.id)}
                onView={() => onViewChallenge?.(challenge.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ChallengeItemProps {
  challenge: Challenge
  onJoin: () => void
  onView: () => void
}

function ChallengeItem({ challenge, onJoin, onView }: ChallengeItemProps) {
  const isFull =
    challenge.maxParticipants !== undefined &&
    challenge.participants >= challenge.maxParticipants

  const getDaysRemaining = () => {
    const now = new Date()
    const end = new Date(challenge.endDate)
    const diff = end.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  const daysRemaining = getDaysRemaining()

  return (
    <div
      className={cn(
        'border-2 rounded-lg p-4 transition-all hover:shadow-md',
        challenge.status === 'active'
          ? 'border-blue-300 bg-blue-50'
          : challenge.status === 'upcoming'
          ? 'border-purple-300 bg-purple-50'
          : 'border-gray-300 bg-gray-50'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-3xl shadow-sm">
          {challenge.icon || getTypeIcon(challenge.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-900">{challenge.title}</h4>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium border',
                    getDifficultyColor(challenge.difficulty)
                  )}
                >
                  {challenge.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
            </div>

            {/* Reward Badge */}
            <div className="flex-shrink-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              +{challenge.reward} pts
            </div>
          </div>

          {/* Progress Bar (for active challenges) */}
          {challenge.status === 'active' && challenge.progress !== undefined && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Your Progress</span>
                <span>{challenge.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Info Row */}
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              👥 {challenge.participants}
              {challenge.maxParticipants && ` / ${challenge.maxParticipants}`} participants
            </span>
            <span className="flex items-center gap-1">
              {getTypeIcon(challenge.type)} {challenge.type}
            </span>
            {challenge.status === 'active' && (
              <span className="flex items-center gap-1 text-orange-600 font-medium">
                ⏰ {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {challenge.status === 'active' && challenge.progress === undefined && (
              <Button variant="primary" size="sm" onClick={onJoin} disabled={isFull}>
                {isFull ? 'Challenge Full' : 'Join Challenge'}
              </Button>
            )}
            {challenge.status === 'active' && challenge.progress !== undefined && (
              <Button variant="primary" size="sm" onClick={onView}>
                Continue
              </Button>
            )}
            {challenge.status === 'upcoming' && (
              <Button variant="secondary" size="sm" onClick={onView}>
                Set Reminder
              </Button>
            )}
            {challenge.status === 'completed' && (
              <Button variant="ghost" size="sm" onClick={onView}>
                View Results
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onView}>
              Details
            </Button>
          </div>

          {/* Status Badge */}
          {challenge.status === 'completed' && challenge.progress === 100 && (
            <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              ✓ Completed
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
