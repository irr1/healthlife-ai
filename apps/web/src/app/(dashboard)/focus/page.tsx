'use client';

import { useState } from 'react';
import TodayFocus from '@/components/focus/TodayFocus';
import TaskTimeline, { Task as TimelineTask } from '@/components/focus/TaskTimeline';
import EnergyInput from '@/components/focus/EnergyInput';
import QuickLog from '@/components/focus/QuickLog';
import { useToast } from '@/components/ui/Toast';
import { useTodayTasks, useTaskActions } from '@/hooks/useTasks';
import { useProgress } from '@/hooks/useJourney';

export default function FocusPage() {
  const [energyLevel, setEnergyLevel] = useState(5);
  const { showToast } = useToast();

  // Fetch today's tasks from API
  const { data: apiTasks, isLoading, error } = useTodayTasks();
  const { completeTask, skipTask } = useTaskActions();

  // Fetch progress for streak
  const { data: progress } = useProgress();

  const handleTaskToggle = async (taskId: string) => {
    const task = apiTasks?.find((t) => t.id.toString() === taskId);
    if (!task) return;

    try {
      if (task.status === 'completed') {
        // Task is already completed, could add "uncomplete" logic if needed
        return;
      }

      // Complete the task
      await completeTask({ taskId: task.id });

      showToast({
        type: 'success',
        title: 'Task completed!',
        message: `Great job completing "${task.title}"`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to complete task',
        message: 'Please try again',
      });
    }
  };

  const handleTaskSkip = async (taskId: string) => {
    try {
      await skipTask({ taskId: parseInt(taskId) });
      showToast({
        type: 'info',
        title: 'Task skipped',
        message: 'Task moved to later',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to skip task',
        message: 'Please try again',
      });
    }
  };

  const handleEnergySave = (value: number) => {
    setEnergyLevel(value);
    showToast({
      type: 'info',
      title: 'Energy level saved',
      message: `Your energy level is ${value}/10. Tasks will be adjusted accordingly.`,
    });
  };

  const handleQuickLog = (actionId: string) => {
    // Логика сохранения будет добавлена позже
    console.log('Logged action:', actionId);
    showToast({
      type: 'success',
      title: 'Logged!',
      message: 'Your activity has been recorded',
    });
  };

  // Convert API tasks to Timeline format
  const timelineTasks: TimelineTask[] =
    apiTasks?.map((task) => ({
      id: task.id.toString(),
      title: task.title,
      description: task.description || '',
      timeOfDay: getTimeOfDay(task.scheduled_date),
      isCompleted: task.status === 'completed',
      duration: task.estimated_duration ? `${task.estimated_duration} min` : undefined,
    })) || [];

  const completedTasks = timelineTasks.filter((t) => t.isCompleted).length;
  const totalTasks = timelineTasks.length;
  const completionProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Check if main goal is completed (all tasks done)
  const mainGoalCompleted = totalTasks > 0 && completedTasks === totalTasks;

  const handleMainGoalComplete = () => {
    showToast({
      type: 'success',
      title: 'Main goal completed!',
      message: 'Amazing work! You hit your daily focus goal.',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Failed to load tasks</h3>
          <p className="text-red-600 text-sm">
            {(error as any)?.detail || 'Please try refreshing the page'}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!apiTasks || apiTasks.length === 0) {
    return (
      <div className="space-y-6">
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks for today</h3>
          <p className="text-gray-600 mb-4">
            You don&apos;t have any tasks scheduled for today. Create a plan to get started!
          </p>
          <button
            onClick={() => (window.location.href = '/onboarding')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Create Your Plan
          </button>
        </div>
      </div>
    );
  }

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
        goal={`Complete ${totalTasks} tasks`}
        description="Your main goal for today. Stay active and healthy!"
        progress={completionProgress}
        isCompleted={mainGoalCompleted}
        onComplete={handleMainGoalComplete}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Timeline (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <TaskTimeline tasks={timelineTasks} onTaskToggle={handleTaskToggle} />
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
          <StatCard label="Completion Rate" value={`${completionProgress}%`} />
          <StatCard label="Energy Level" value={`${energyLevel}/10`} />
          <StatCard label="Current Streak" value={`${progress?.streak_days || 0} days`} />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}

// Helper function to determine time of day from date
function getTimeOfDay(dateStr: string): 'morning' | 'afternoon' | 'evening' {
  const date = new Date(dateStr);
  const hour = date.getHours();

  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
