'use client'

import { useState } from 'react'
import {
  SquadCard,
  ChallengeList,
  Leaderboard,
  type Squad,
  type Challenge,
  type LeaderboardEntry,
} from '@/components/tribe'
import { useToast } from '@/components/ui/Toast'

// TODO: Replace with API calls
const mockSquads: Squad[] = [
  {
    id: '1',
    name: 'Summer Warriors',
    description: 'Crushing fitness goals together this summer!',
    members: [
      { id: '1', name: 'Alex Chen', level: 12, streak: 45, isOnline: true },
      { id: '2', name: 'Jordan Smith', level: 10, streak: 30, isOnline: true },
      { id: '3', name: 'You', level: 8, streak: 21, isOnline: true },
      { id: '4', name: 'Sarah Johnson', level: 9, streak: 28 },
      { id: '5', name: 'Mike Davis', level: 11, streak: 35, isOnline: true },
    ],
    maxMembers: 10,
    totalPoints: 15750,
    rank: 3,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Early Birds',
    description: 'Morning workout enthusiasts 🌅',
    members: [
      { id: '6', name: 'Emma Wilson', level: 15, streak: 60, isOnline: true },
      { id: '7', name: 'Chris Brown', level: 13, streak: 50 },
      { id: '8', name: 'Lisa Martinez', level: 14, streak: 55, isOnline: true },
    ],
    maxMembers: 8,
    totalPoints: 22400,
    rank: 1,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Nutrition Ninjas',
    description: 'Mastering healthy eating habits',
    members: [
      { id: '9', name: 'David Lee', level: 10, streak: 32 },
      { id: '10', name: 'Amy Taylor', level: 9, streak: 28, isOnline: true },
    ],
    maxMembers: 6,
    totalPoints: 8500,
    createdAt: '2024-02-01',
  },
]

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '7-Day Water Challenge',
    description: 'Drink 8 glasses of water every day for a week',
    type: 'weekly',
    status: 'active',
    participants: 1245,
    reward: 500,
    progress: 57,
    startDate: '2024-02-05',
    endDate: '2024-02-12',
    icon: '💧',
    difficulty: 'easy',
  },
  {
    id: '2',
    title: '30-Day Plank Challenge',
    description: 'Increase your plank time by 10 seconds each day',
    type: 'monthly',
    status: 'active',
    participants: 856,
    reward: 2000,
    progress: 23,
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    icon: '💪',
    difficulty: 'hard',
  },
  {
    id: '3',
    title: '10K Steps Daily',
    description: 'Walk at least 10,000 steps every day this week',
    type: 'weekly',
    status: 'active',
    participants: 2341,
    maxParticipants: 3000,
    reward: 750,
    startDate: '2024-02-05',
    endDate: '2024-02-12',
    icon: '👟',
    difficulty: 'medium',
  },
  {
    id: '4',
    title: 'Meditation Monday',
    description: 'Practice 10 minutes of meditation every Monday',
    type: 'weekly',
    status: 'upcoming',
    participants: 432,
    reward: 300,
    startDate: '2024-02-19',
    endDate: '2024-02-26',
    icon: '🧘',
    difficulty: 'easy',
  },
  {
    id: '5',
    title: 'January Fitness Master',
    description: 'Complete all daily tasks for the entire month',
    type: 'monthly',
    status: 'completed',
    participants: 124,
    reward: 5000,
    progress: 100,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    icon: '🏆',
    difficulty: 'hard',
  },
]

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    rank: 1,
    name: 'Emma Wilson',
    points: 15420,
    streak: 60,
    level: 15,
    change: 2,
  },
  {
    id: '2',
    rank: 2,
    name: 'Alex Chen',
    points: 14850,
    streak: 45,
    level: 12,
    change: -1,
  },
  {
    id: '3',
    rank: 3,
    name: 'Chris Brown',
    points: 13200,
    streak: 50,
    level: 13,
    change: 1,
  },
  {
    id: '4',
    rank: 4,
    name: 'Lisa Martinez',
    points: 12750,
    streak: 55,
    level: 14,
    change: 0,
  },
  {
    id: '5',
    rank: 5,
    name: 'Mike Davis',
    points: 11900,
    streak: 35,
    level: 11,
    change: 3,
  },
  {
    id: '6',
    rank: 6,
    name: 'You',
    points: 9850,
    streak: 21,
    level: 8,
    change: -2,
    isCurrentUser: true,
  },
  {
    id: '7',
    rank: 7,
    name: 'Sarah Johnson',
    points: 8900,
    streak: 28,
    level: 9,
    change: 1,
  },
]

export default function TribePage() {
  const [userSquadId] = useState('1') // User is member of Summer Warriors
  const { showToast } = useToast()

  const handleJoinSquad = (squadId: string) => {
    showToast({ type: 'success', title: 'Joined squad successfully! Welcome aboard! 🎉' })
  }

  const handleLeaveSquad = () => {
    showToast({ type: 'info', title: 'Left squad. You can join another squad anytime!' })
  }

  const handleViewSquadDetails = (squadId: string) => {
    showToast({ type: 'info', title: 'Squad details coming soon!' })
  }

  const handleJoinChallenge = (challengeId: string) => {
    showToast({ type: 'success', title: 'Challenge joined! Good luck! 💪' })
  }

  const handleViewChallenge = (challengeId: string) => {
    showToast({ type: 'info', title: 'Challenge details coming soon!' })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Tribe</h1>
        <p className="text-gray-600">Your community and support network</p>
      </div>

      {/* Squads Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">🏅 Squads</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockSquads.map((squad) => (
            <SquadCard
              key={squad.id}
              squad={squad}
              isUserMember={squad.id === userSquadId}
              onJoin={() => handleJoinSquad(squad.id)}
              onLeave={handleLeaveSquad}
              onViewDetails={() => handleViewSquadDetails(squad.id)}
            />
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Challenges (2/3 width) */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">🏆 Challenges</h2>
          <ChallengeList
            challenges={mockChallenges}
            onJoinChallenge={handleJoinChallenge}
            onViewChallenge={handleViewChallenge}
          />
        </div>

        {/* Right Column - Leaderboard (1/3 width) */}
        <div>
          <h2 className="text-2xl font-bold mb-4">👑 Leaderboard</h2>
          <Leaderboard
            entries={mockLeaderboard}
            type="global"
            period="weekly"
          />
        </div>
      </div>
    </div>
  )
}
