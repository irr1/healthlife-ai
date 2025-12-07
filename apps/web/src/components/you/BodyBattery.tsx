'use client'

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface EnergyLevel {
  time: string
  level: number // 0-100
  activity?: string
}

export interface BodyBatteryProps {
  energyLevels: EnergyLevel[]
  currentLevel?: number
  title?: string
}

export default function BodyBattery({
  energyLevels,
  currentLevel,
  title = 'Body Battery',
}: BodyBatteryProps) {
  const maxLevel = Math.max(...energyLevels.map((e) => e.level))
  const avgLevel = Math.round(
    energyLevels.reduce((sum, e) => sum + e.level, 0) / energyLevels.length
  )

  const getBatteryColor = (level: number): string => {
    if (level >= 75) return 'bg-green-500'
    if (level >= 50) return 'bg-yellow-500'
    if (level >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getBatteryIcon = (level: number): string => {
    if (level >= 75) return '🔋'
    if (level >= 50) return '🔌'
    if (level >= 25) return '⚡'
    return '🪫'
  }

  const getEnergyStatus = (level: number): string => {
    if (level >= 75) return 'High Energy'
    if (level >= 50) return 'Moderate Energy'
    if (level >= 25) return 'Low Energy'
    return 'Recharge Needed'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Track your energy levels throughout the day
        </p>
      </CardHeader>

      <CardContent>
        {/* Current Battery Level */}
        {currentLevel !== undefined && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Energy</p>
                <p className="text-3xl font-bold text-gray-900">
                  {currentLevel}%
                </p>
              </div>
              <div className="text-6xl">{getBatteryIcon(currentLevel)}</div>
            </div>

            {/* Battery Visual */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
              <div
                className={cn(
                  'h-4 rounded-full transition-all duration-500',
                  getBatteryColor(currentLevel)
                )}
                style={{ width: `${currentLevel}%` }}
              />
            </div>

            <p className="text-sm font-medium text-gray-700 text-center">
              {getEnergyStatus(currentLevel)}
            </p>
          </div>
        )}

        {/* Energy Chart */}
        <div className="space-y-4 mb-6">
          <h4 className="font-semibold text-gray-700">Energy Timeline</h4>

          {/* Chart */}
          <div className="relative h-48 bg-gray-50 rounded-lg p-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="ml-8 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 25, 50, 75, 100].map((line) => (
                  <div
                    key={line}
                    className="w-full border-t border-gray-200"
                  />
                ))}
              </div>

              {/* Energy line chart */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Line path */}
                <polyline
                  points={energyLevels
                    .map((level, index) => {
                      const x = (index / (energyLevels.length - 1)) * 100
                      const y = 100 - level.level
                      return `${x}%,${y}%`
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  className="drop-shadow-md"
                />

                {/* Area fill */}
                <polygon
                  points={`0%,100% ${energyLevels
                    .map((level, index) => {
                      const x = (index / (energyLevels.length - 1)) * 100
                      const y = 100 - level.level
                      return `${x}%,${y}%`
                    })
                    .join(' ')} 100%,100%`}
                  fill="url(#gradient)"
                  opacity="0.3"
                />

                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Data points */}
                {energyLevels.map((level, index) => {
                  const x = (index / (energyLevels.length - 1)) * 100
                  const y = 100 - level.level
                  return (
                    <circle
                      key={index}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="4"
                      fill="#3B82F6"
                      className="hover:r-6 cursor-pointer transition-all"
                    >
                      <title>{`${level.time}: ${level.level}%${level.activity ? ` - ${level.activity}` : ''}`}</title>
                    </circle>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* X-axis labels (time) */}
          <div className="flex justify-between text-xs text-gray-500 ml-8">
            {energyLevels.map((level, index) => {
              if (index % Math.ceil(energyLevels.length / 5) === 0) {
                return <span key={index}>{level.time}</span>
              }
              return null
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{currentLevel || avgLevel}%</p>
            <p className="text-xs text-gray-600">Current</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{maxLevel}%</p>
            <p className="text-xs text-gray-600">Peak</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{avgLevel}%</p>
            <p className="text-xs text-gray-600">Average</p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Tip:</span>{' '}
            {currentLevel !== undefined && currentLevel < 50
              ? 'Your energy is low. Consider taking a break, hydrating, or having a healthy snack.'
              : 'Great energy levels! This is a good time for challenging tasks or workouts.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
