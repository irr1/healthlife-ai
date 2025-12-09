'use client'

import { useState } from 'react'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export interface EnergyInputProps {
  value?: number // 1-10
  onChange?: (value: number) => void
  onSave?: (value: number) => void
}

const energyLevels = [
  { value: 1, label: 'Exhausted', emoji: '😴', color: 'bg-red-500' },
  { value: 2, label: 'Very Low', emoji: '😓', color: 'bg-red-400' },
  { value: 3, label: 'Low', emoji: '😔', color: 'bg-orange-400' },
  { value: 4, label: 'Below Average', emoji: '😐', color: 'bg-orange-300' },
  { value: 5, label: 'Average', emoji: '🙂', color: 'bg-yellow-400' },
  { value: 6, label: 'Above Average', emoji: '😊', color: 'bg-yellow-300' },
  { value: 7, label: 'Good', emoji: '😄', color: 'bg-lime-400' },
  { value: 8, label: 'Great', emoji: '😃', color: 'bg-green-400' },
  { value: 9, label: 'Excellent', emoji: '😁', color: 'bg-green-500' },
  { value: 10, label: 'Peak', emoji: '🚀', color: 'bg-green-600' },
]

export default function EnergyInput({ value = 5, onChange, onSave }: EnergyInputProps) {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (newValue: number) => {
    setCurrentValue(newValue)
    onChange?.(newValue)
  }

  const currentLevel = energyLevels.find((level) => level.value === currentValue)!

  return (
    <Card>
      <CardHeader>
        <CardTitle>How&apos;s Your Energy?</CardTitle>
        <CardDescription>
          Rate your current energy level (1-10). This helps AI adjust your tasks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Current Selection Display */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{currentLevel.emoji}</div>
          <div className="text-2xl font-bold text-gray-900">{currentValue}/10</div>
          <div className="text-sm text-gray-600">{currentLevel.label}</div>
        </div>

        {/* Slider */}
        <div className="mb-6">
          <input
            type="range"
            min="1"
            max="10"
            value={currentValue}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right,
                #ef4444 0%,
                #f97316 33%,
                #fbbf24 50%,
                #84cc16 66%,
                #22c55e 100%)`,
            }}
          />
        </div>

        {/* Energy Scale */}
        <div className="grid grid-cols-10 gap-1 mb-4">
          {energyLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => handleChange(level.value)}
              className={cn(
                'aspect-square rounded-lg transition-all hover:scale-110',
                level.color,
                currentValue === level.value
                  ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                  : 'opacity-50 hover:opacity-80'
              )}
              title={level.label}
            >
              <span className="text-xs">{level.value}</span>
            </button>
          ))}
        </div>

        {/* Save Button */}
        {onSave && (
          <button
            onClick={() => onSave(currentValue)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save Energy Level
          </button>
        )}

        {/* Info Text */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 <strong>Pro tip:</strong>{' '}
            {currentValue <= 4 && 'Low energy detected. AI will adjust tasks to be easier.'}
            {currentValue >= 5 && currentValue <= 7 && 'Normal energy. Tasks will stay as planned.'}
            {currentValue >= 8 && 'High energy! AI may suggest additional challenges.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
