'use client';

import {
  BodyBattery,
  HabitGrid,
  BiometricsChart,
  SettingsForm,
  type EnergyLevel,
  type HabitDay,
  type BiometricMetric,
  type UserSettings,
} from '@/components/you';
import { useToast } from '@/components/ui/Toast';
import { useBodyBattery, useHabitsAnalytics } from '@/hooks/useAnalytics';
import { useUser, useUpdateUser } from '@/hooks/useUser';

export default function YouPage() {
  const { showToast } = useToast();

  // Fetch analytics data from API
  const { data: bodyBatteryData, isLoading: bodyBatteryLoading, error: bodyBatteryError } = useBodyBattery(7);
  const { data: habitsData, isLoading: habitsLoading, error: habitsError } = useHabitsAnalytics(30);

  // Fetch user data for settings
  const { data: userData, isLoading: userLoading } = useUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

  const handleSaveSettings = async (newSettings: UserSettings) => {
    try {
      // Update only the fields that exist in the API
      await updateUser({
        full_name: newSettings.name,
        email: newSettings.email,
      });

      showToast({ type: 'success', title: 'Settings saved successfully!' });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to save settings',
        message: 'Please try again',
      });
    }
  };

  const handleDayClick = (date: string) => {
    showToast({ type: 'info', title: `Viewing habits for ${date}` });
  };

  // Convert API body battery data to EnergyLevel format
  const energyLevels: EnergyLevel[] =
    bodyBatteryData?.data?.map((point: any) => ({
      time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      level: point.energy_level || point.value || 50,
      activity: point.activity || point.note,
    })) || [];

  const currentLevel = energyLevels.length > 0 ? energyLevels[energyLevels.length - 1].level : 50;

  // Convert API habits data to HabitDay format
  const habitData: HabitDay[] =
    habitsData?.daily_data?.map((day: any) => ({
      date: day.date,
      completed: Math.round((day.completed_count / (day.total_count || 1)) * 100),
      habitsCompleted: day.completed_count || 0,
      totalHabits: day.total_count || 0,
    })) || [];

  // Mock biometrics (not in API yet)
  const mockBiometrics: BiometricMetric[] = [
    {
      type: 'weight',
      label: 'Weight',
      unit: 'kg',
      color: '#3B82F6',
      icon: '⚖️',
      goal: 75,
      data: [
        { date: 'Week 1', value: 80 },
        { date: 'Week 2', value: 79.5 },
        { date: 'Week 3', value: 79 },
        { date: 'Week 4', value: 78.5 },
      ],
    },
    {
      type: 'sleep',
      label: 'Sleep',
      unit: 'hours',
      color: '#8B5CF6',
      icon: '😴',
      goal: 8,
      data: [
        { date: 'Mon', value: 7.5 },
        { date: 'Tue', value: 7.2 },
        { date: 'Wed', value: 8.1 },
        { date: 'Thu', value: 7.8 },
        { date: 'Fri', value: 6.5 },
        { date: 'Sat', value: 8.5 },
        { date: 'Sun', value: 8.2 },
      ],
    },
  ];

  // Convert user data to settings format
  const userSettings: UserSettings = {
    name: userData?.full_name || '',
    email: userData?.email || '',
    age: 28,
    gender: 'male',
    height: 178,
    currentWeight: 78,
    goalWeight: 75,
    activityLevel: 'moderate',
    goals: ['Lose weight', 'Improve fitness'],
    notifications: {
      email: true,
      push: true,
      daily: true,
      weekly: false,
    },
  };

  // Loading state
  if (bodyBatteryLoading || habitsLoading || userLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (bodyBatteryError || habitsError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-600">Track your progress and manage your settings</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Failed to load analytics data</h3>
          <p className="text-red-600 text-sm">
            {(bodyBatteryError as any)?.detail || (habitsError as any)?.detail || 'Please try refreshing the page'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600">Track your progress and manage your settings</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Body Battery */}
          <BodyBattery energyLevels={energyLevels} currentLevel={currentLevel} />

          {/* Habit Grid */}
          <HabitGrid habitData={habitData} weeks={12} onDayClick={handleDayClick} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Biometrics Chart */}
          <BiometricsChart metrics={mockBiometrics} defaultMetric="weight" />
        </div>
      </div>

      {/* Settings Form - Full Width */}
      <div>
        <SettingsForm initialSettings={userSettings} onSave={handleSaveSettings} isLoading={isUpdating} />
      </div>
    </div>
  );
}
