'use client'

import { useState } from 'react'
import {
  RoadmapVisualizer,
  MilestoneCard,
  WhyBlock,
  WeeklyReview,
  type Phase,
  type Milestone,
  type WeeklyStats,
} from '@/components/journey'
import { useToast } from '@/components/ui/Toast'

// TODO: Replace with API calls
const mockPhases: Phase[] = [
  {
    id: '1',
    title: 'Phase 1: Foundation',
    description: 'Build basic habits and establish routine',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-01-28',
  },
  {
    id: '2',
    title: 'Phase 2: Growth',
    description: 'Increase intensity and challenge yourself',
    status: 'current',
    progress: 65,
    startDate: '2024-01-29',
  },
  {
    id: '3',
    title: 'Phase 3: Mastery',
    description: 'Maintain lifestyle and become unstoppable',
    status: 'locked',
  },
  {
    id: '4',
    title: 'Phase 4: Legacy',
    description: 'Help others and share your journey',
    status: 'locked',
  },
]

const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Lose First 2kg',
    description: 'First weight milestone',
    target: '-2 kg',
    current: '-1.5 kg',
    isCompleted: false,
    category: 'weight',
    deadline: 'Feb 15, 2024',
  },
  {
    id: '2',
    title: '7-Day Streak',
    description: 'Complete tasks 7 days in a row',
    target: '7 days',
    current: '5 days',
    isCompleted: false,
    category: 'habit',
    deadline: 'Feb 10, 2024',
  },
  {
    id: '3',
    title: 'First 10 Workouts',
    description: 'Complete your first 10 workout sessions',
    target: '10 workouts',
    current: '7 workouts',
    isCompleted: false,
    category: 'workout',
    deadline: 'Feb 20, 2024',
  },
  {
    id: '4',
    title: 'Joined HealthLife',
    description: 'Started your health transformation',
    target: 'Get started',
    isCompleted: true,
    category: 'other',
  },
  {
    id: '5',
    title: 'First Week Complete',
    description: 'Successfully completed first week',
    target: '1 week',
    isCompleted: true,
    category: 'habit',
  },
]

const mockWeeklyStats: WeeklyStats = {
  tasksCompleted: 18,
  totalTasks: 21,
  completionRate: 86,
  streak: 5,
  topHabits: ['Morning workout', 'Drinking 2L water', 'Meditation'],
  improvements: ['Evening routine consistency', 'Meal planning'],
}

export default function JourneyPage() {
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones)
  const { showToast } = useToast()

  const handlePhaseClick = (phaseId: string) => {
    const phase = mockPhases.find((p) => p.id === phaseId)
    if (phase?.status === 'locked') {
      showToast({ type: 'info', title: 'This phase is locked. Complete the current phase to unlock!' })
    } else if (phase?.status === 'current') {
      showToast({ type: 'success', title: `You're currently in ${phase.title}. Keep going! 💪` })
    } else if (phase?.status === 'completed') {
      showToast({ type: 'success', title: `${phase.title} completed on ${phase.endDate}! 🎉` })
    }
  }

  const handleEditWhy = () => {
    showToast({ type: 'info', title: 'Edit feature coming soon!' })
  }

  const handleViewDetails = () => {
    showToast({ type: 'info', title: 'Detailed report coming soon!' })
  }

  const handleGenerateNextWeek = () => {
    showToast({ type: 'success', title: 'Generating next week plan... 🤖' })
    // TODO: Call AI API to generate next week plan
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Your Journey</h1>
        <p className="text-gray-600">Track your progress and celebrate milestones</p>
      </div>

      {/* Why Block - Motivational reminder */}
      <WhyBlock
        reason="I want to feel energized, confident, and be able to play with my kids without getting tired"
        goal="Lose 10kg and build sustainable healthy habits"
        dateStarted="January 1, 2024"
        onEdit={handleEditWhy}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Roadmap (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          <RoadmapVisualizer phases={mockPhases} onPhaseClick={handlePhaseClick} />

          {/* Weekly Review */}
          <WeeklyReview
            week={2}
            stats={mockWeeklyStats}
            isCurrentWeek={true}
            onViewDetails={handleViewDetails}
            onGenerateNextWeek={handleGenerateNextWeek}
          />
        </div>

        {/* Right Column - Milestones (1/3 width) */}
        <div>
          <MilestoneCard milestones={milestones} title="🏆 Milestones" />
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <StatCard
          label="Current Phase"
          value="Phase 2"
          icon="🎯"
          color="text-blue-600"
        />
        <StatCard
          label="Days Active"
          value="35"
          icon="📅"
          color="text-green-600"
        />
        <StatCard
          label="Milestones Achieved"
          value={`${milestones.filter((m) => m.isCompleted).length}/${milestones.length}`}
          icon="🏅"
          color="text-yellow-600"
        />
        <StatCard
          label="Current Streak"
          value={`${mockWeeklyStats.streak} days`}
          icon="🔥"
          color="text-orange-600"
        />
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  icon: string
  color: string
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  )
}
