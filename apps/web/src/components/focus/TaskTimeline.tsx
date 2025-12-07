'use client'

import { useState } from 'react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export type TimeOfDay = 'morning' | 'afternoon' | 'evening'

export interface Task {
  id: string
  title: string
  description?: string
  timeOfDay: TimeOfDay
  isCompleted: boolean
  duration?: string // e.g., "15 min"
}

export interface TaskTimelineProps {
  tasks: Task[]
  onTaskToggle?: (taskId: string) => void
}

const timeLabels = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
}

const timeColors = {
  morning: 'border-blue-500 bg-blue-50',
  afternoon: 'border-green-500 bg-green-50',
  evening: 'border-purple-500 bg-purple-50',
}

const timeIcons = {
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌙',
}

export default function TaskTimeline({ tasks, onTaskToggle }: TaskTimelineProps) {
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.timeOfDay]) {
      acc[task.timeOfDay] = []
    }
    acc[task.timeOfDay].push(task)
    return acc
  }, {} as Record<TimeOfDay, Task[]>)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {(['morning', 'afternoon', 'evening'] as TimeOfDay[]).map((timeOfDay) => {
            const timeTasks = groupedTasks[timeOfDay] || []
            if (timeTasks.length === 0) return null

            return (
              <div key={timeOfDay}>
                {/* Time Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{timeIcons[timeOfDay]}</span>
                  <h3 className="text-lg font-bold text-gray-900">
                    {timeLabels[timeOfDay]}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {timeTasks.filter((t) => t.isCompleted).length}/{timeTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="space-y-2 pl-8">
                  {timeTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      timeOfDay={timeOfDay}
                      onToggle={onTaskToggle}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

interface TaskItemProps {
  task: Task
  timeOfDay: TimeOfDay
  onToggle?: (taskId: string) => void
}

function TaskItem({ task, timeOfDay, onToggle }: TaskItemProps) {
  return (
    <div
      className={cn(
        'border-l-4 pl-4 py-3 rounded-r-lg transition-all cursor-pointer hover:shadow-md',
        timeColors[timeOfDay],
        task.isCompleted && 'opacity-60'
      )}
      onClick={() => onToggle?.(task.id)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          className={cn(
            'mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
            task.isCompleted
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-300 hover:border-blue-400'
          )}
        >
          {task.isCompleted && (
            <svg
              className="w-3 h-3 text-white"
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
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                'font-medium text-gray-900',
                task.isCompleted && 'line-through'
              )}
            >
              {task.title}
            </p>
            {task.duration && (
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                {task.duration}
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
