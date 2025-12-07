'use client'

import { useState } from 'react'
import TodayFocus from '@/components/focus/TodayFocus'
import TaskTimeline, { Task } from '@/components/focus/TaskTimeline'
import EnergyInput from '@/components/focus/EnergyInput'
import QuickLog from '@/components/focus/QuickLog'
import { useToast } from '@/components/ui/Toast'

// Mock data - будет заменено на реальные данные из API
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Drink water',
    description: 'Start your day with 2 glasses of water',
    timeOfDay: 'morning',
    isCompleted: false,
    duration: '5 min',
  },
  {
    id: '2',
    title: 'Light stretching',
    description: 'Gentle morning stretches',
    timeOfDay: 'morning',
    isCompleted: false,
    duration: '10 min',
  },
  {
    id: '3',
    title: 'Healthy lunch',
    description: 'Grilled chicken with vegetables',
    timeOfDay: 'afternoon',
    isCompleted: false,
  },
  {
    id: '4',
    title: '30-minute walk',
    description: 'Walk in the park or neighborhood',
    timeOfDay: 'afternoon',
    isCompleted: false,
    duration: '30 min',
  },
  {
    id: '5',
    title: 'Light dinner',
    description: 'Salmon with quinoa and salad',
    timeOfDay: 'evening',
    isCompleted: false,
  },
  {
    id: '6',
    title: 'Read 20 minutes',
    description: 'Read a book before bed',
    timeOfDay: 'evening',
    isCompleted: false,
    duration: '20 min',
  },
]

export default function FocusPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [mainGoalCompleted, setMainGoalCompleted] = useState(false)
  const [energyLevel, setEnergyLevel] = useState(5)
  const { showToast } = useToast()

  const handleTaskToggle = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    )

    const task = tasks.find((t) => t.id === taskId)
    if (task && !task.isCompleted) {
      showToast({
        type: 'success',
        title: 'Task completed!',
        message: `Great job completing "${task.title}"`,
      })
    }
  }

  const handleMainGoalComplete = () => {
    setMainGoalCompleted(true)
    showToast({
      type: 'success',
      title: 'Main goal completed!',
      message: 'Amazing work! You hit your daily focus goal.',
    })
  }

  const handleEnergySave = (value: number) => {
    setEnergyLevel(value)
    showToast({
      type: 'info',
      title: 'Energy level saved',
      message: `Your energy level is ${value}/10. Tasks will be adjusted accordingly.`,
    })
  }

  const handleQuickLog = (actionId: string) => {
    // Логика сохранения будет добавлена позже
    console.log('Logged action:', actionId)
  }

  const completedTasks = tasks.filter((t) => t.isCompleted).length
  const totalTasks = tasks.length
  const progress = Math.round((completedTasks / totalTasks) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Focus</h1>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Today's Main Focus */}
      <TodayFocus
        goal="Walk 10,000 steps"
        description="Your main goal for today. Stay active and healthy!"
        progress={progress}
        isCompleted={mainGoalCompleted}
        onComplete={handleMainGoalComplete}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Timeline (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <TaskTimeline tasks={tasks} onTaskToggle={handleTaskToggle} />
        </div>

        {/* Right Column - Energy & Quick Log (1/3 width) */}
        <div className="space-y-6">
          <EnergyInput value={energyLevel} onChange={setEnergyLevel} onSave={handleEnergySave} />
          <QuickLog onLog={handleQuickLog} />
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Tasks Completed" value={`${completedTasks}/${totalTasks}`} />
          <StatCard label="Completion Rate" value={`${progress}%`} />
          <StatCard label="Energy Level" value={`${energyLevel}/10`} />
          <StatCard label="Current Streak" value="3 days" />
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  )
}
