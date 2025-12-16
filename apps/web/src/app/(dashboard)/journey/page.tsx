'use client';

import {
  RoadmapVisualizer,
  MilestoneCard,
  WhyBlock,
  WeeklyReview,
  type Phase,
  type Milestone,
} from '@/components/journey';
import { useToast } from '@/components/ui/Toast';
import { useRoadmap, useMilestones, useProgress, useSubmitWeeklyReview } from '@/hooks/useJourney';

export default function JourneyPage() {
  const { showToast } = useToast();

  // Fetch journey data from API
  const { data: roadmapData, isLoading: roadmapLoading, error: roadmapError } = useRoadmap();
  const {
    data: milestonesData,
    isLoading: milestonesLoading,
    error: milestonesError,
  } = useMilestones();
  const { data: progressData } = useProgress();
  const { mutateAsync: submitReview, isPending: isSubmittingReview } = useSubmitWeeklyReview();

  const handleWeeklyReviewSubmit = async (weeklyData: any) => {
    try {
      await submitReview({
        week_number: Math.ceil((new Date().getTime() - new Date().getFullYear()) / (7 * 24 * 60 * 60 * 1000)),
        wins: weeklyData.wins || [],
        challenges: weeklyData.challenges || [],
        lessons: weeklyData.lessons || [],
        energy_average: weeklyData.energy || 5,
        notes: weeklyData.notes,
      });

      showToast({
        type: 'success',
        title: 'Weekly review submitted!',
        message: 'Great job reflecting on your progress',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to submit review',
        message: 'Please try again',
      });
    }
  };

  // Convert API roadmap data to Phase format
  const phases: Phase[] =
    roadmapData?.phases?.map((phase: any, index: number) => ({
      id: index.toString(),
      title: phase.name || `Phase ${index + 1}`,
      description: phase.description || '',
      status:
        index < (roadmapData.current_phase || 0)
          ? 'completed'
          : index === (roadmapData.current_phase || 0)
          ? 'current'
          : 'locked',
      progress: index === (roadmapData.current_phase || 0) ? roadmapData.completion || 0 : undefined,
      startDate: phase.start_date,
      endDate: phase.end_date,
    })) || [];

  // Convert API milestones to Milestone format
  const milestones: Milestone[] =
    milestonesData?.map((milestone: any) => ({
      id: milestone.name,
      title: milestone.name,
      description: `Phase ${milestone.phase + 1}`,
      target: milestone.phase_name,
      current: milestone.status === 'achieved' ? 'Completed' : 'In Progress',
      isCompleted: milestone.status === 'achieved',
      category: 'other' as const,
      deadline: '',
    })) || [];

  // Loading state
  if (roadmapLoading || milestonesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your journey...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (roadmapError || milestonesError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Journey</h1>
          <p className="text-gray-600">Track your transformation over time</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Failed to load journey data</h3>
          <p className="text-red-600 text-sm">
            {(roadmapError as any)?.detail || (milestonesError as any)?.detail || 'Please try refreshing the page'}
          </p>
        </div>
      </div>
    );
  }

  // Empty state - no active plan
  if (!roadmapData || !roadmapData.phases || roadmapData.phases.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Journey</h1>
          <p className="text-gray-600">Track your transformation over time</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No journey started yet</h3>
          <p className="text-gray-600 mb-4">
            Create your personalized health plan to begin your transformation journey!
          </p>
          <button
            onClick={() => (window.location.href = '/onboarding')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Journey</h1>
        <p className="text-gray-600">Track your transformation over time</p>
      </div>

      {/* Roadmap Visualizer */}
      <RoadmapVisualizer phases={phases} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Milestones & Why (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <MilestoneCard milestones={milestones} title="Your Milestones" />

          <WhyBlock
            reason="Transform my health and feel amazing every day"
            goal={roadmapData.plan_title || 'Achieve optimal health'}
            dateStarted={new Date().toLocaleDateString()}
          />
        </div>

        {/* Right Column - Weekly Review (1/3 width) */}
        <div className="space-y-6">
          <WeeklyReview
            week={Math.ceil(
              (new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) /
                (7 * 24 * 60 * 60 * 1000)
            )}
            stats={{
              tasksCompleted: progressData?.tasks_completed || 0,
              totalTasks: progressData?.tasks_total || 0,
              completionRate: Math.round(
                ((progressData?.tasks_completed || 0) / (progressData?.tasks_total || 1)) * 100
              ),
              streak: progressData?.streak_days || 0,
              topHabits: [],
              improvements: [],
            }}
            isCurrentWeek={true}
          />
        </div>
      </div>

      {/* Progress Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold text-lg mb-4">Journey Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Overall Progress"
            value={`${Math.round(progressData?.overall_completion || 0)}%`}
          />
          <StatCard
            label="Current Phase"
            value={`${(progressData?.current_phase || 0) + 1}/${progressData?.total_phases || 0}`}
          />
          <StatCard
            label="Milestones Reached"
            value={`${progressData?.milestones_reached || 0}/${progressData?.milestones_total || 0}`}
          />
          <StatCard label="Streak" value={`${progressData?.streak_days || 0} days`} />
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
