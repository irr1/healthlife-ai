'use client'

import { cn } from '@/lib/utils'

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  className?: string
  animated?: boolean
}

export default function Logo({
  size = 'md',
  variant = 'full',
  className,
  animated = true
}: LogoProps) {
  const sizes = {
    sm: { container: 'h-8', icon: 'h-8 w-8', text: 'text-lg' },
    md: { container: 'h-10', icon: 'h-10 w-10', text: 'text-xl' },
    lg: { container: 'h-14', icon: 'h-14 w-14', text: 'text-3xl' },
    xl: { container: 'h-20', icon: 'h-20 w-20', text: 'text-5xl' },
  }

  const sizeClasses = sizes[size]

  return (
    <div className={cn('flex items-center gap-3 group', sizeClasses.container, className)}>
      {/* Icon */}
      {(variant === 'icon' || variant === 'full') && (
        <div className={cn(
          'relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-2 shadow-lg transition-all duration-300',
          sizeClasses.icon,
          animated && 'group-hover:scale-110 group-hover:shadow-xl'
        )}>
          {/* Heart icon */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="relative z-10 text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>

          {/* Plus sign overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="w-3/5 h-3/5 text-white opacity-90"
            >
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
        </div>
      )}

      {/* Text */}
      {(variant === 'text' || variant === 'full') && (
        <div className="flex items-baseline gap-0.5 leading-none">
          <span className={cn(
            'font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent transition-all duration-300',
            sizeClasses.text,
            animated && 'group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-orange-700'
          )}>
            HealthLife
          </span>
          <span className={cn(
            'font-bold text-blue-600 transition-colors duration-300',
            sizeClasses.text,
            animated && 'group-hover:text-blue-700'
          )}>
            AI
          </span>
        </div>
      )}
    </div>
  )
}
