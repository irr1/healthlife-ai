'use client'

import { useState, useRef } from 'react'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import MessageBubble, { type Message } from './MessageBubble'
import { cn } from '@/lib/utils'

export interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  isLoading?: boolean
  placeholder?: string
  disabled?: boolean
}

export default function ChatWindow({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = 'Ask your AI coach anything...',
  disabled = false,
}: ChatWindowProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || disabled) return

    onSendMessage(input.trim())
    setInput('')
    inputRef.current?.focus()
  }

  const quickActions = [
    { label: '💪 Workout tips', value: 'Give me workout tips for today' },
    { label: '🥗 Meal ideas', value: 'Suggest healthy meal ideas' },
    { label: '😴 Sleep advice', value: 'How can I improve my sleep?' },
    { label: '🎯 Motivation', value: 'I need motivation to stay on track' },
  ]

  const handleQuickAction = (value: string) => {
    if (isLoading || disabled) return
    onSendMessage(value)
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardContent className="flex flex-col h-full p-0">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-lg">Your AI Coach</h3>
              <p className="text-sm opacity-90">Always here to help you succeed</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">💬</div>
              <h4 className="text-xl font-bold text-gray-700 mb-2">
                Start a conversation
              </h4>
              <p className="text-gray-600 mb-6 max-w-md">
                Ask me anything about fitness, nutrition, habits, or your health journey.
                I'm here to guide you!
              </p>

              {/* Quick Actions for empty state */}
              <div className="grid grid-cols-2 gap-2 max-w-md">
                {quickActions.map((action) => (
                  <button
                    key={action.value}
                    onClick={() => handleQuickAction(action.value)}
                    disabled={disabled}
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Quick Actions Bar (when there are messages) */}
        {messages.length > 0 && (
          <div className="px-6 py-2 bg-white border-t border-gray-200">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickActions.map((action) => (
                <button
                  key={action.value}
                  onClick={() => handleQuickAction(action.value)}
                  disabled={isLoading || disabled}
                  className={cn(
                    'px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium',
                    'hover:bg-purple-100 hover:text-purple-700 transition-all whitespace-nowrap',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || disabled}
              isLoading={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>

          {/* Character count */}
          {input.length > 0 && (
            <p className="text-xs text-gray-500 mt-2 text-right">
              {input.length} / 500 characters
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
