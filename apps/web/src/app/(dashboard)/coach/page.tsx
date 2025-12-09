'use client'

import { useState } from 'react'
import {
  ChatWindow,
  DailyInsightsList,
  KnowledgeBase,
  type Message,
  type Insight,
  type Article,
} from '@/components/coach'
import { useToast } from '@/components/ui/Toast'

// TODO: Replace with API calls
const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'tip',
    title: 'Morning Exercise Benefits',
    message: 'Studies show that exercising in the morning can improve your sleep quality by up to 65%. Your body temperature rises during exercise and takes about 4-5 hours to drop, signaling your body it\'s time to rest.',
    date: 'Today at 6:00 AM',
    isNew: true,
  },
  {
    id: '2',
    type: 'achievement',
    title: '5-Day Streak Milestone!',
    message: 'Congratulations! You\'ve maintained a 5-day streak of completing your daily tasks. Research shows that it takes 21 days to form a habit - you\'re already 24% there!',
    date: 'Today at 9:00 AM',
    isNew: true,
  },
  {
    id: '3',
    type: 'suggestion',
    title: 'Optimize Your Protein Intake',
    message: 'Based on your recent meals, consider adding 20-30g of protein to your breakfast. This can help reduce cravings throughout the day and support muscle recovery from your workouts.',
    date: 'Yesterday at 7:30 PM',
  },
]

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Science of Building Sustainable Habits',
    description: 'Learn the proven psychological principles behind habit formation and how to apply them to your health journey.',
    category: 'habits',
    readTime: '8 min read',
    tags: ['psychology', 'behavior change', 'routine'],
    isPopular: true,
  },
  {
    id: '2',
    title: 'Protein: Complete Guide for Beginners',
    description: 'Everything you need to know about protein - how much you need, best sources, and timing for optimal results.',
    category: 'nutrition',
    readTime: '12 min read',
    tags: ['protein', 'macros', 'muscle building'],
    isPopular: true,
  },
  {
    id: '3',
    title: 'Morning vs Evening Workouts: What\'s Best?',
    description: 'Discover the pros and cons of different workout times and how to choose what works best for your lifestyle.',
    category: 'fitness',
    readTime: '6 min read',
    tags: ['timing', 'performance', 'schedule'],
  },
  {
    id: '4',
    title: 'Sleep Optimization: 10 Evidence-Based Tips',
    description: 'Improve your sleep quality with these scientifically proven strategies for better rest and recovery.',
    category: 'sleep',
    readTime: '10 min read',
    tags: ['sleep hygiene', 'recovery', 'health'],
    isPopular: true,
  },
  {
    id: '5',
    title: 'Overcoming Mental Barriers in Fitness',
    description: 'Learn how to push through mental blocks and develop the mindset of a champion.',
    category: 'mindset',
    readTime: '7 min read',
    tags: ['psychology', 'motivation', 'mindfulness'],
  },
  {
    id: '6',
    title: 'Meal Prep 101: Save Time and Eat Healthy',
    description: 'A beginner-friendly guide to meal prepping that will save you time and keep you on track.',
    category: 'nutrition',
    readTime: '15 min read',
    tags: ['meal prep', 'planning', 'efficiency'],
  },
]

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your AI health coach. I\'m here to help you with fitness, nutrition, habits, and overall wellness. What would you like to talk about today?',
    timestamp: new Date(Date.now() - 60000),
  },
]

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<Insight[]>(mockInsights)
  const { showToast } = useToast()

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Show typing indicator
    setIsLoading(true)
    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    // TODO: Replace with actual AI API call
    setTimeout(() => {
      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => m.id !== 'typing'))

      // Add AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(content),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleDismissInsight = (insightId: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== insightId))
    showToast({ type: 'success', title: 'Insight dismissed' })
  }

  const handleViewMoreInsight = (insightId: string) => {
    showToast({ type: 'info', title: 'Full insight view coming soon!' })
  }

  const handleArticleClick = (articleId: string) => {
    showToast({ type: 'info', title: 'Article viewer coming soon!' })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">AI Coach</h1>
        <p className="text-gray-600">Your personal guide to health and wellness</p>
      </div>

      {/* Daily Insights */}
      <div>
        <h2 className="text-2xl font-bold mb-4">💡 Daily Insights</h2>
        <DailyInsightsList
          insights={insights}
          onDismiss={handleDismissInsight}
          onViewMore={handleViewMoreInsight}
          maxDisplay={2}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Chat (2/3 width) */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">💬 Chat with AI Coach</h2>
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column - Knowledge Base (1/3 width) */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📚 Knowledge Base</h2>
          <KnowledgeBase articles={mockArticles} onArticleClick={handleArticleClick} />
        </div>
      </div>
    </div>
  )
}

// Mock AI responses - TODO: Replace with actual AI API
function getMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
    return 'Great question about workouts! Based on your current fitness level, I recommend starting with 3-4 sessions per week. Focus on compound movements like squats, deadlifts, and push-ups. Would you like me to create a personalized workout plan for you?'
  }

  if (lowerMessage.includes('meal') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
    return 'Nutrition is key to reaching your goals! I\'d recommend focusing on whole foods: lean proteins, complex carbs, and healthy fats. Aim for 4-5 meals throughout the day to keep your metabolism active. What specific nutritional goals do you have?'
  }

  if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
    return 'Sleep is crucial for recovery and overall health. Try to maintain a consistent sleep schedule, avoid screens 1 hour before bed, and keep your room cool (around 65-68°F). Aim for 7-9 hours per night. How many hours are you currently getting?'
  }

  if (lowerMessage.includes('motivation') || lowerMessage.includes('give up')) {
    return 'I understand that staying motivated can be challenging! Remember why you started this journey. Break your big goals into smaller, achievable milestones. Celebrate every win, no matter how small. You\'ve got this! What\'s been your biggest challenge lately?'
  }

  return 'That\'s a great question! I\'m here to help you with anything related to fitness, nutrition, sleep, habits, or mental wellness. Feel free to ask me anything specific, and I\'ll provide personalized advice based on your goals and current progress.'
}
