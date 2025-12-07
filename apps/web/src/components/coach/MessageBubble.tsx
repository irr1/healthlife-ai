import { cn } from '@/lib/utils'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  isTyping?: boolean
}

export interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex gap-3 max-w-[80%]',
          isUser && 'flex-row-reverse'
        )}
      >
        {/* Avatar */}
        {!isSystem && (
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold',
              isUser
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-purple-500 to-pink-600'
            )}
          >
            {isUser ? '👤' : '🤖'}
          </div>
        )}

        {/* Message Content */}
        <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
          {/* Message Bubble */}
          <div
            className={cn(
              'rounded-2xl px-4 py-3 shadow-sm',
              isUser
                ? 'bg-blue-500 text-white rounded-tr-sm'
                : isSystem
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                : 'bg-gray-100 text-gray-900 rounded-tl-sm'
            )}
          >
            {message.isTyping ? (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
          </div>

          {/* Timestamp */}
          {!message.isTyping && (
            <span className="text-xs text-gray-500 mt-1 px-2">
              {formatTimestamp(message.timestamp)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
