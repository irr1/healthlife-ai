'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/focus', label: 'Focus', icon: '🎯', gradient: 'from-blue-500 to-cyan-500' },
  { href: '/journey', label: 'Journey', icon: '🗺️', gradient: 'from-purple-500 to-pink-500' },
  { href: '/coach', label: 'AI Coach', icon: '🧠', gradient: 'from-green-500 to-emerald-500' },
  { href: '/you', label: 'You', icon: '📊', gradient: 'from-orange-500 to-red-500' },
  { href: '/tribe', label: 'Tribe', icon: '🔥', gradient: 'from-pink-500 to-rose-500' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 glass border-r border-white/20 shadow-2xl z-10 animate-slideInLeft">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <Logo size="lg" animated />
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  'group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-white/50 hover:scale-102 hover:shadow-md'
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient overlay on hover */}
                {!isActive && hoveredItem === item.href && (
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-r opacity-10 transition-opacity',
                    item.gradient
                  )} />
                )}

                {/* Icon */}
                <span className={cn(
                  'text-2xl transition-transform duration-300',
                  hoveredItem === item.href && 'scale-125'
                )}>
                  {item.icon}
                </span>

                {/* Label */}
                <span className={cn(
                  'font-semibold text-base relative z-10',
                  isActive && 'animate-fadeIn'
                )}>
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}

          {/* Divider */}
          <div className="my-4 border-t border-white/30" />

          {/* Components Demo Link */}
          <Link
            href="/components-demo"
            className={cn(
              'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-gray-500 hover:text-gray-700 hover:bg-white/50',
              pathname === '/components-demo' && 'bg-white/70 text-gray-900'
            )}
          >
            <span className="text-xl">🎨</span>
            <span className="font-medium text-sm">UI Components</span>
          </Link>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 glass">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/50 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-600">Level 12</p>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 p-8 relative z-0">
        <div className="animate-fadeInUp">
          {children}
        </div>
      </main>
    </div>
  )
}
