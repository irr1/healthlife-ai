import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface SquadMember {
  id: string
  name: string
  avatar?: string
  level: number
  streak: number
  isOnline?: boolean
}

export interface Squad {
  id: string
  name: string
  description: string
  members: SquadMember[]
  maxMembers: number
  totalPoints: number
  rank?: number
  createdAt: string
}

export interface SquadCardProps {
  squad: Squad
  isUserMember?: boolean
  onJoin?: () => void
  onLeave?: () => void
  onViewDetails?: () => void
}

export default function SquadCard({
  squad,
  isUserMember = false,
  onJoin,
  onLeave,
  onViewDetails,
}: SquadCardProps) {
  const isFull = squad.members.length >= squad.maxMembers
  const availableSpots = squad.maxMembers - squad.members.length

  return (
    <Card variant="elevated" className="hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">{squad.name}</h3>
              {squad.rank && squad.rank <= 3 && (
                <span className="text-xl">
                  {squad.rank === 1 ? '🥇' : squad.rank === 2 ? '🥈' : '🥉'}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{squad.description}</p>
          </div>

          {/* Rank Badge */}
          {squad.rank && (
            <div className="flex-shrink-0 ml-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                #{squad.rank}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{squad.members.length}</p>
            <p className="text-xs text-gray-600">Members</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {squad.totalPoints.toLocaleString('en-US')}
            </p>
            <p className="text-xs text-gray-600">Points</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{availableSpots}</p>
            <p className="text-xs text-gray-600">Spots Left</p>
          </div>
        </div>

        {/* Members */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Squad Members</h4>
          <div className="flex flex-wrap gap-2">
            {squad.members.slice(0, 8).map((member) => (
              <div
                key={member.id}
                className="relative group"
                title={`${member.name} - Level ${member.level} - ${member.streak} day streak`}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm relative',
                    member.isOnline && 'ring-2 ring-green-500 ring-offset-2'
                  )}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{member.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Online indicator */}
                {member.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {member.name}
                  <br />
                  Lvl {member.level} • {member.streak}🔥
                </div>
              </div>
            ))}

            {squad.members.length > 8 && (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                +{squad.members.length - 8}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Squad Progress</span>
            <span>
              {squad.members.length}/{squad.maxMembers}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(squad.members.length / squad.maxMembers) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isUserMember ? (
            <>
              <Button variant="primary" onClick={onViewDetails} className="flex-1">
                View Squad
              </Button>
              {onLeave && (
                <Button variant="danger" onClick={onLeave} size="sm">
                  Leave
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={onJoin}
                disabled={isFull}
                className="flex-1"
              >
                {isFull ? 'Squad Full' : 'Join Squad'}
              </Button>
              {onViewDetails && (
                <Button variant="ghost" onClick={onViewDetails} size="sm">
                  Details
                </Button>
              )}
            </>
          )}
        </div>

        {/* Member Badge */}
        {isUserMember && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-800 font-medium">
              ✓ You&apos;re a member of this squad
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
