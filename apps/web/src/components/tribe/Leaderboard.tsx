'use client'

import { useState } from 'react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export type LeaderboardType = 'global' | 'squad' | 'friends'
export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'allTime'

export interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatar?: string
  points: number
  streak: number
  level: number
  change?: number // rank change from previous period (+/- or 0)
  isCurrentUser?: boolean
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[]
  type?: LeaderboardType
  period?: LeaderboardPeriod
  onTypeChange?: (type: LeaderboardType) => void
  onPeriodChange?: (period: LeaderboardPeriod) => void
  title?: string
  showFilters?: boolean
}

export default function Leaderboard({
  entries,
  type = 'global',
  period = 'weekly',
  onTypeChange,
  onPeriodChange,
  title = 'Leaderboard',
  showFilters = true,
}: LeaderboardProps) {
  const [selectedType, setSelectedType] = useState<LeaderboardType>(type)
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>(period)

  const handleTypeChange = (newType: LeaderboardType) => {
    setSelectedType(newType)
    onTypeChange?.(newType)
  }

  const handlePeriodChange = (newPeriod: LeaderboardPeriod) => {
    setSelectedPeriod(newPeriod)
    onPeriodChange?.(newPeriod)
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-orange-400 to-orange-600'
    return 'from-gray-200 to-gray-400'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          See how you rank against the community
        </p>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 mb-6">
            {/* Type Filter */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Leaderboard Type</p>
              <div className="flex gap-2">
                {(['global', 'squad', 'friends'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTypeChange(t)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      selectedType === t
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Period Filter */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Time Period</p>
              <div className="flex gap-2 overflow-x-auto">
                {(['daily', 'weekly', 'monthly', 'allTime'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePeriodChange(p)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                      selectedPeriod === p
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {p === 'allTime' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h4 className="text-lg font-bold text-gray-700 mb-2">No rankings yet</h4>
            <p className="text-gray-600">Be the first to earn points!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <LeaderboardRow key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        )}

        {/* User Position (if not in top list) */}
        {entries.length > 0 && !entries.some((e) => e.isCurrentUser) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-2">Your Position</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-center text-gray-600 text-sm">
                Keep completing tasks to climb the leaderboard!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry
  index: number
}

function LeaderboardRow({ entry, index }: LeaderboardRowProps) {
  const isTopThree = entry.rank <= 3
  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-orange-400 to-orange-600'
    return 'from-gray-200 to-gray-400'
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-all',
        entry.isCurrentUser
          ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
          : isTopThree
          ? 'bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md'
          : 'bg-white border border-gray-100 hover:bg-gray-50'
      )}
    >
      {/* Rank */}
      <div className="flex-shrink-0 w-12 text-center">
        {isTopThree ? (
          <div className="text-3xl">{getRankBadge(entry.rank)}</div>
        ) : (
          <div
            className={cn(
              'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm',
              getRankColor(entry.rank)
            )}
          >
            #{entry.rank}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden">
          {entry.avatar ? (
            <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg">{entry.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className={cn('font-bold text-gray-900 truncate', entry.isCurrentUser && 'text-blue-600')}>
            {entry.name}
            {entry.isCurrentUser && <span className="text-blue-500 ml-1">(You)</span>}
          </p>
          {entry.change !== undefined && entry.change !== 0 && (
            <span
              className={cn(
                'text-xs font-medium',
                entry.change > 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {entry.change > 0 ? '↑' : '↓'} {Math.abs(entry.change)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            ⭐ Level {entry.level}
          </span>
          <span className="flex items-center gap-1">
            🔥 {entry.streak} days
          </span>
        </div>
      </div>

      {/* Points */}
      <div className="flex-shrink-0 text-right">
        <p className="text-xl font-bold text-gray-900">
          {entry.points.toLocaleString('en-US')}
        </p>
        <p className="text-xs text-gray-600">points</p>
      </div>
    </div>
  )
}
