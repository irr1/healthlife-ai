'use client';

import { useState, useEffect } from 'react';
import {
  ChatWindow,
  DailyInsightsList,
  KnowledgeBase,
  type Message,
  type Insight,
  type Article,
} from '@/components/coach';
import { useToast } from '@/components/ui/Toast';
import { useChatWithCoach, useDailyInsight, useKnowledgeSearch } from '@/hooks/useCoach';

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Hello! I'm your AI health coach. I'm here to help you with fitness, nutrition, habits, and overall wellness. What would you like to talk about today?",
    timestamp: new Date(Date.now() - 60000),
  },
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [knowledgeQuery, setKnowledgeQuery] = useState('health');
  const { showToast } = useToast();

  // Fetch daily insight from API
  const { data: insightData, isLoading: insightLoading, error: insightError, refetch: refetchInsight } = useDailyInsight();

  // Fetch knowledge base articles from API
  const {
    data: knowledgeData,
    isLoading: knowledgeLoading,
    error: knowledgeError,
  } = useKnowledgeSearch(knowledgeQuery, undefined, 6);

  // Chat with AI coach mutation
  const { mutateAsync: sendChatMessage, isPending: isChatting } = useChatWithCoach();

  // Convert API insight to Insight format
  const insights: Insight[] = insightData
    ? [
        {
          id: '1',
          type: 'tip',
          title: 'Daily Insight',
          message: insightData.content || insightData.message || 'No insight available',
          date: new Date().toLocaleString(),
          isNew: true,
        },
      ]
    : [];

  // Convert API knowledge results to Article format
  const articles: Article[] = knowledgeData
    ? knowledgeData.map((result: any, index: number) => ({
        id: index.toString(),
        title: result.title || result.content?.substring(0, 50) + '...',
        description: result.content || result.summary || 'No description available',
        category: result.category || 'general',
        readTime: '5 min read',
        tags: result.tags || [],
        isPopular: result.relevance_score > 0.8,
      }))
    : [];

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Show typing indicator
    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Call AI API
      const response = await sendChatMessage({ message: content });

      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => m.id !== 'typing'));

      // Add AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response || response.message || 'I apologize, but I could not generate a response.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => m.id !== 'typing'));

      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      showToast({
        type: 'error',
        title: 'Failed to send message',
        message: 'Please try again',
      });
    }
  };

  const handleDismissInsight = async () => {
    showToast({ type: 'success', title: 'Generating new insight...' });
    // Refetch to get a new AI-generated insight
    await refetchInsight();
  };

  const handleViewMoreInsight = () => {
    showToast({ type: 'info', title: 'Full insight view coming soon!' });
  };

  const handleArticleClick = () => {
    showToast({ type: 'info', title: 'Article viewer coming soon!' });
  };

  // Loading state
  if (insightLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your AI coach...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (insightError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">AI Coach</h1>
          <p className="text-gray-600">Your personal guide to health and wellness</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Failed to load AI coach data</h3>
          <p className="text-red-600 text-sm">
            {(insightError as any)?.detail || 'Please try refreshing the page'}
          </p>
        </div>
      </div>
    );
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
          <ChatWindow messages={messages} onSendMessage={handleSendMessage} isLoading={isChatting} />
        </div>

        {/* Right Column - Knowledge Base (1/3 width) */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📚 Knowledge Base</h2>
          <KnowledgeBase articles={articles} onArticleClick={handleArticleClick} />
        </div>
      </div>
    </div>
  );
}
