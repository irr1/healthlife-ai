'use client'

import { useState } from 'react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export type BiometricType = 'weight' | 'bodyFat' | 'muscleMass' | 'waist' | 'sleep' | 'steps'

export interface BiometricData {
  date: string
  value: number
}

export interface BiometricMetric {
  type: BiometricType
  label: string
  unit: string
  data: BiometricData[]
  goal?: number
  color: string
  icon: string
}

export interface BiometricsChartProps {
  metrics: BiometricMetric[]
  defaultMetric?: BiometricType
  title?: string
}

export default function BiometricsChart({
  metrics,
  defaultMetric,
  title = 'Biometric Data',
}: BiometricsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<BiometricType>(
    defaultMetric || metrics[0]?.type || 'weight'
  )

  const currentMetric = metrics.find((m) => m.type === selectedMetric)

  if (!currentMetric) {
    return (
      <Card>
        <CardContent padding="md">
          <p className="text-center text-gray-600">No biometric data available</p>
        </CardContent>
      </Card>
    )
  }

  const { data, label, unit, goal, color, icon } = currentMetric

  // Calculate stats
  const latestValue = data[data.length - 1]?.value || 0
  const oldestValue = data[0]?.value || 0
  const change = latestValue - oldestValue
  const changePercent = oldestValue !== 0 ? ((change / oldestValue) * 100).toFixed(1) : '0'

  const minValue = Math.min(...data.map((d) => d.value))
  const maxValue = Math.max(...data.map((d) => d.value))
  const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Track your body metrics over time
        </p>
      </CardHeader>

      <CardContent>
        {/* Metric Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {metrics.map((metric) => (
            <button
              key={metric.type}
              onClick={() => setSelectedMetric(metric.type)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2',
                selectedMetric === metric.type
                  ? `bg-${metric.color} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              style={
                selectedMetric === metric.type
                  ? { backgroundColor: metric.color, color: 'white' }
                  : {}
              }
            >
              <span>{metric.icon}</span>
              <span>{metric.label}</span>
            </button>
          ))}
        </div>

        {/* Current Value Display */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current {label}</p>
              <p className="text-4xl font-bold text-gray-900">
                {latestValue.toFixed(1)}
                <span className="text-xl text-gray-600 ml-2">{unit}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={cn(
                    'text-sm font-medium',
                    change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600'
                  )}
                >
                  {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change).toFixed(1)} {unit}
                </span>
                <span className="text-xs text-gray-500">
                  ({changePercent}% from start)
                </span>
              </div>
            </div>

            <div className="text-6xl">{icon}</div>
          </div>

          {goal && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Goal: {goal} {unit}</span>
                <span className="font-medium text-gray-900">
                  {Math.abs(latestValue - goal).toFixed(1)} {unit} to go
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Line Chart */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Progress Over Time</h4>

          <div className="relative h-48 bg-gray-50 rounded-lg p-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
              <span>{maxValue.toFixed(0)}</span>
              <span>{((maxValue + minValue) / 2).toFixed(0)}</span>
              <span>{minValue.toFixed(0)}</span>
            </div>

            {/* Chart area */}
            <div className="ml-12 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2].map((line) => (
                  <div key={line} className="w-full border-t border-gray-200" />
                ))}
              </div>

              {/* Goal line */}
              {goal && goal >= minValue && goal <= maxValue && (
                <div
                  className="absolute w-full border-t-2 border-dashed border-yellow-400"
                  style={{
                    top: `${((maxValue - goal) / (maxValue - minValue)) * 100}%`,
                  }}
                >
                  <span className="absolute -top-2 right-0 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                    Goal
                  </span>
                </div>
              )}

              {/* Chart SVG */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Line path */}
                <polyline
                  points={data
                    .map((point, index) => {
                      const x = (index / (data.length - 1)) * 100
                      const y = ((maxValue - point.value) / (maxValue - minValue)) * 100
                      return `${x}%,${y}%`
                    })
                    .join(' ')}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  className="drop-shadow-md"
                />

                {/* Area fill */}
                <polygon
                  points={`0%,100% ${data
                    .map((point, index) => {
                      const x = (index / (data.length - 1)) * 100
                      const y = ((maxValue - point.value) / (maxValue - minValue)) * 100
                      return `${x}%,${y}%`
                    })
                    .join(' ')} 100%,100%`}
                  fill={color}
                  opacity="0.2"
                />

                {/* Data points */}
                {data.map((point, index) => {
                  const x = (index / (data.length - 1)) * 100
                  const y = ((maxValue - point.value) / (maxValue - minValue)) * 100
                  return (
                    <circle
                      key={index}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="4"
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-6 transition-all"
                    >
                      <title>{`${point.date}: ${point.value} ${unit}`}</title>
                    </circle>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* X-axis labels (dates) */}
          <div className="flex justify-between text-xs text-gray-500 ml-12 mt-2">
            <span>{data[0]?.date}</span>
            <span>{data[Math.floor(data.length / 2)]?.date}</span>
            <span>{data[data.length - 1]?.date}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{minValue.toFixed(1)}</p>
            <p className="text-xs text-gray-600">Lowest</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-blue-600">{avgValue.toFixed(1)}</p>
            <p className="text-xs text-gray-600">Average</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{maxValue.toFixed(1)}</p>
            <p className="text-xs text-gray-600">Highest</p>
          </div>
        </div>

        {/* Insights */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">📊 Insight:</span>{' '}
            {change < 0
              ? `Great progress! You've reduced your ${label.toLowerCase()} by ${Math.abs(change).toFixed(1)} ${unit}.`
              : change > 0
              ? `Your ${label.toLowerCase()} has increased by ${change.toFixed(1)} ${unit}. Keep monitoring!`
              : `Your ${label.toLowerCase()} has remained stable.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
