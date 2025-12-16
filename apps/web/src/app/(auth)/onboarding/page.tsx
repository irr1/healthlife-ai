'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGeneratePlan } from '@/hooks/usePlans';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';

type OnboardingStep = 'welcome' | 'goals' | 'experience' | 'preferences' | 'generating';

interface OnboardingData {
  primaryGoal: string;
  secondaryGoals: string[];
  fitnessLevel: string;
  experienceYears: number;
  availableTime: string;
  preferredActivities: string[];
  healthConditions: string[];
  motivations: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const { mutateAsync: generatePlan, isPending } = useGeneratePlan();

  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingData>({
    primaryGoal: '',
    secondaryGoals: [],
    fitnessLevel: '',
    experienceYears: 0,
    availableTime: '',
    preferredActivities: [],
    healthConditions: [],
    motivations: [],
  });

  const primaryGoals = [
    { id: 'weight_loss', label: 'Lose Weight', icon: '📉' },
    { id: 'muscle_gain', label: 'Build Muscle', icon: '💪' },
    { id: 'endurance', label: 'Improve Endurance', icon: '🏃' },
    { id: 'flexibility', label: 'Increase Flexibility', icon: '🧘' },
    { id: 'health', label: 'Overall Health', icon: '❤️' },
    { id: 'energy', label: 'More Energy', icon: '⚡' },
  ];

  const fitnessLevels = [
    { id: 'beginner', label: 'Beginner', description: 'Just starting out' },
    { id: 'intermediate', label: 'Intermediate', description: 'Regular exercise' },
    { id: 'advanced', label: 'Advanced', description: 'Experienced athlete' },
  ];

  const timeOptions = [
    { id: '15min', label: '15 min/day', icon: '⏱️' },
    { id: '30min', label: '30 min/day', icon: '⏰' },
    { id: '1hour', label: '1 hour/day', icon: '🕐' },
    { id: '2hours', label: '2+ hours/day', icon: '⏳' },
  ];

  const activities = [
    'Running', 'Gym', 'Yoga', 'Swimming', 'Cycling', 'Walking',
    'Dancing', 'Sports', 'Hiking', 'Home Workouts'
  ];

  const handleFinish = async () => {
    setStep('generating');

    try {
      // Generate plan with user preferences
      await generatePlan({
        primary_goal: data.primaryGoal,
        fitness_level: data.fitnessLevel,
        available_time: data.availableTime,
        preferred_activities: data.preferredActivities,
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/focus');
      }, 2000);
    } catch (error) {
      console.error('Failed to generate plan:', error);
      // Handle error - maybe show error message and allow retry
    }
  };

  const toggleSelection = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    }
    return [...array, item];
  };

  // Welcome Step
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-6">
            <span className="text-5xl">🎯</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to HealthLife AI!
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
            Let&apos;s create your personalized health and fitness plan. This will only take 2 minutes.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">
                Personalized plans tailored to your goals
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">
                Monitor your journey with detailed analytics
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-semibold text-gray-900 mb-2">Stay Motivated</h3>
              <p className="text-sm text-gray-600">
                Daily coaching and community support
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setStep('goals')}
            className="px-12"
          >
            Let&apos;s Get Started
          </Button>
        </div>
      </div>
    );
  }

  // Goals Step
  if (step === 'goals') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Step 1 of 3</span>
              <div className="flex gap-1">
                <div className="h-2 w-16 bg-blue-500 rounded-full" />
                <div className="h-2 w-16 bg-gray-200 rounded-full" />
                <div className="h-2 w-16 bg-gray-200 rounded-full" />
              </div>
            </div>
            <CardTitle>What&apos;s your primary goal?</CardTitle>
            <p className="text-gray-600 mt-2">Choose the goal that matters most to you right now</p>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {primaryGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setData({ ...data, primaryGoal: goal.id })}
                  className={cn(
                    'p-6 border-2 rounded-xl transition-all text-left',
                    data.primaryGoal === goal.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="text-4xl mb-3">{goal.icon}</div>
                  <h3 className="font-semibold text-gray-900">{goal.label}</h3>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep('welcome')}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep('experience')}
                disabled={!data.primaryGoal}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Experience Step
  if (step === 'experience') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Step 2 of 3</span>
              <div className="flex gap-1">
                <div className="h-2 w-16 bg-blue-500 rounded-full" />
                <div className="h-2 w-16 bg-blue-500 rounded-full" />
                <div className="h-2 w-16 bg-gray-200 rounded-full" />
              </div>
            </div>
            <CardTitle>What&apos;s your fitness level?</CardTitle>
            <p className="text-gray-600 mt-2">This helps us create the right plan for you</p>
          </CardHeader>

          <CardContent>
            <div className="space-y-3 mb-6">
              {fitnessLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setData({ ...data, fitnessLevel: level.id })}
                  className={cn(
                    'w-full p-5 border-2 rounded-xl transition-all text-left flex items-center justify-between',
                    data.fitnessLevel === level.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{level.label}</h3>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </div>
                  {data.fitnessLevel === level.id && (
                    <div className="text-2xl text-purple-500">✓</div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep('goals')}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep('preferences')}
                disabled={!data.fitnessLevel}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Preferences Step
  if (step === 'preferences') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Step 3 of 3</span>
              <div className="flex gap-1">
                <div className="h-2 w-16 bg-blue-500 rounded-full" />
                <div className="h-2 w-16 bg-blue-500 rounded-full" />
                <div className="h-2 w-16 bg-blue-500 rounded-full" />
              </div>
            </div>
            <CardTitle>How much time can you commit?</CardTitle>
            <p className="text-gray-600 mt-2">Select your available time per day</p>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {timeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setData({ ...data, availableTime: option.id })}
                  className={cn(
                    'p-6 border-2 rounded-xl transition-all',
                    data.availableTime === option.id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <h3 className="font-semibold text-gray-900">{option.label}</h3>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                What activities do you enjoy? (Optional)
              </h3>
              <div className="flex flex-wrap gap-2">
                {activities.map((activity) => (
                  <button
                    key={activity}
                    onClick={() =>
                      setData({
                        ...data,
                        preferredActivities: toggleSelection(data.preferredActivities, activity),
                      })
                    }
                    className={cn(
                      'px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium',
                      data.preferredActivities.includes(activity)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    )}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep('experience')}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleFinish}
                disabled={!data.availableTime || isPending}
              >
                {isPending ? 'Creating Plan...' : 'Create My Plan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generating Step
  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-lg">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Creating your personalized plan...
          </h2>

          <p className="text-gray-600 mb-8">
            Our AI is analyzing your goals and preferences to create the perfect plan for you.
          </p>

          <div className="space-y-3 text-left bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-2xl">✓</div>
              <div>
                <p className="font-medium text-gray-900">Analyzing your goals</p>
                <p className="text-sm text-gray-500">Understanding what you want to achieve</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl">✓</div>
              <div>
                <p className="font-medium text-gray-900">Matching fitness level</p>
                <p className="text-sm text-gray-500">Creating appropriate challenges</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl animate-pulse">⏳</div>
              <div>
                <p className="font-medium text-gray-900">Generating your roadmap</p>
                <p className="text-sm text-gray-500">Building your transformation journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
