# Coach Components Guide

Comprehensive guide for all AI Coach page components in HealthLife AI.

## Overview

The Coach page provides an AI-powered conversational interface for health coaching, daily insights, and a knowledge base of articles. Users can chat with the AI coach, receive personalized insights, and browse educational content.

---

## Components

### 1. MessageBubble

Individual message component for chat interface.

**Location**: `src/components/coach/MessageBubble.tsx`

**Features**:
- Three message roles: user, assistant (AI), system
- Different styling for each role
- Avatar icons (👤 for user, 🤖 for AI)
- Typing indicator animation
- Timestamp with relative time formatting
- Responsive bubble design with proper alignment

**Props**:
```typescript
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
```

**Usage Example**:
```tsx
const message: Message = {
  id: '1',
  role: 'assistant',
  content: 'Hello! How can I help you today?',
  timestamp: new Date(),
}

<MessageBubble message={message} />
```

**Visual Styles**:
- **User**: Blue background, white text, right-aligned
- **Assistant**: Gray background, dark text, left-aligned
- **System**: Yellow background, amber text, centered
- **Typing**: Animated three-dot indicator

**Timestamp Formatting**:
- < 1 minute: "Just now"
- < 60 minutes: "Xm ago"
- < 24 hours: "Xh ago"
- Older: Time format (e.g., "3:45 PM")

---

### 2. ChatWindow

Main chat interface component with message history and input.

**Location**: `src/components/coach/ChatWindow.tsx`

**Features**:
- Scrollable message history
- Auto-scroll to latest message
- Text input with character counter
- Quick action buttons (4 predefined prompts)
- Empty state with suggestions
- Loading state with typing indicator
- Message sending via Enter key
- Gradient header with AI coach branding

**Props**:
```typescript
export interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  isLoading?: boolean
  placeholder?: string
  disabled?: boolean
}
```

**Usage Example**:
```tsx
const [messages, setMessages] = useState<Message[]>([])
const [isLoading, setIsLoading] = useState(false)

const handleSendMessage = (content: string) => {
  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date(),
  }
  setMessages(prev => [...prev, userMessage])

  // Call AI API and add response
  // ...
}

<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  isLoading={isLoading}
/>
```

**Quick Actions**:
Default quick actions included:
- 💪 Workout tips
- 🥗 Meal ideas
- 😴 Sleep advice
- 🎯 Motivation

**Empty State**:
Shows when `messages.length === 0`:
- Welcome message
- 4 quick action buttons to start conversation
- Engaging visual design

**Layout**:
- Header: 64px gradient bar with coach info
- Messages Area: Flex-1, scrollable, gray background
- Quick Actions: Horizontal scrollable pills
- Input Area: Text input + Send button

---

### 3. DailyInsight

Component for displaying AI-generated daily insights and tips.

**Location**: `src/components/coach/DailyInsight.tsx`

**Features**:
- Four insight types with different styling
- "NEW" badge for fresh insights
- Dismiss functionality
- "Learn More" action button
- Decorative background icon
- Category-based color coding

**Props**:
```typescript
export type InsightType = 'tip' | 'warning' | 'achievement' | 'suggestion'

export interface Insight {
  id: string
  type: InsightType
  title: string
  message: string
  date: string
  isNew?: boolean
}

export interface DailyInsightProps {
  insight: Insight
  onDismiss?: () => void
  onViewMore?: () => void
}
```

**Insight Types**:
- **tip** (💡): Blue - Educational tips and advice
- **warning** (⚠️): Yellow - Important alerts or cautions
- **achievement** (🏆): Green - Milestones and accomplishments
- **suggestion** (✨): Purple - AI recommendations

**Usage Example**:
```tsx
const insight: Insight = {
  id: '1',
  type: 'achievement',
  title: '5-Day Streak!',
  message: 'You maintained a 5-day streak. Keep it up!',
  date: 'Today at 9:00 AM',
  isNew: true,
}

<DailyInsight
  insight={insight}
  onDismiss={() => console.log('Dismissed')}
  onViewMore={() => console.log('View more')}
/>
```

**DailyInsightsList Component**:

For displaying multiple insights:

```typescript
export interface DailyInsightsListProps {
  insights: Insight[]
  onDismiss?: (insightId: string) => void
  onViewMore?: (insightId: string) => void
  maxDisplay?: number  // Default: 3
}
```

**Usage**:
```tsx
<DailyInsightsList
  insights={insights}
  onDismiss={(id) => handleDismiss(id)}
  onViewMore={(id) => handleViewMore(id)}
  maxDisplay={2}
/>
```

**Empty State**:
Shows when no insights available with friendly message.

---

### 4. KnowledgeBase

Searchable article browser with category filtering.

**Location**: `src/components/coach/KnowledgeBase.tsx`

**Features**:
- Search functionality across title, description, and tags
- Category filtering (5 categories + "All")
- Article cards with icons and metadata
- Popular article badges
- Read time estimates
- Tag display
- Click handling for article navigation
- Results counter
- Empty state for no results

**Props**:
```typescript
export type ArticleCategory = 'nutrition' | 'fitness' | 'habits' | 'mindset' | 'sleep'

export interface Article {
  id: string
  title: string
  description: string
  category: ArticleCategory
  readTime: string
  tags: string[]
  isPopular?: boolean
}

export interface KnowledgeBaseProps {
  articles: Article[]
  onArticleClick?: (articleId: string) => void
}
```

**Categories**:
- **nutrition** (🥗): Green - Nutrition and diet
- **fitness** (💪): Orange - Workouts and exercise
- **habits** (✅): Blue - Habit formation
- **mindset** (🧠): Purple - Mental health and mindset
- **sleep** (😴): Indigo - Sleep optimization

**Usage Example**:
```tsx
const articles: Article[] = [
  {
    id: '1',
    title: 'The Science of Building Sustainable Habits',
    description: 'Learn proven principles behind habit formation.',
    category: 'habits',
    readTime: '8 min read',
    tags: ['psychology', 'behavior change', 'routine'],
    isPopular: true,
  },
]

<KnowledgeBase
  articles={articles}
  onArticleClick={(id) => console.log('Article clicked:', id)}
/>
```

**Search Behavior**:
- Case-insensitive
- Searches: title, description, tags
- Real-time filtering
- Preserves category filter during search

**Filter Behavior**:
- "All" shows all categories
- Specific category shows only that category
- Combines with search query

---

## Page Integration

### Coach Page Structure

**Location**: `src/app/(dashboard)/coach/page.tsx`

Layout:
```
┌─────────────────────────────────────────┐
│ Page Header                             │
├─────────────────────────────────────────┤
│ Daily Insights (2 max)                  │
├────────────────────────────┬────────────┤
│ ChatWindow (2/3)           │ Knowledge  │
│                            │ Base (1/3) │
│                            │            │
│                            │            │
└────────────────────────────┴────────────┘
```

### State Management

```tsx
const [messages, setMessages] = useState<Message[]>(initialMessages)
const [isLoading, setIsLoading] = useState(false)
const [insights, setInsights] = useState<Insight[]>(mockInsights)

// Handlers
const handleSendMessage = async (content: string) => {
  // Add user message
  // Show typing indicator
  // Call AI API
  // Add AI response
}

const handleDismissInsight = (insightId: string) => {
  setInsights(prev => prev.filter(i => i.id !== insightId))
}
```

### Mock Data

Current implementation uses mock data:
- **mockInsights**: 3 sample insights
- **mockArticles**: 6 sample articles
- **initialMessages**: Welcome message from AI
- **getMockResponse()**: Simple keyword-based responses

All marked with `// TODO: Replace with API calls`

---

## API Integration (Future)

### Expected API Endpoints

1. **POST /api/v1/coach/chat**
   ```typescript
   // Send message and get AI response
   Body: { message: string, conversationId?: string }
   Response: {
     message: string,
     conversationId: string,
     suggestions?: string[]
   }
   ```

2. **GET /api/v1/coach/insights**
   ```typescript
   // Get daily insights
   Response: { insights: Insight[] }
   ```

3. **DELETE /api/v1/coach/insights/:id**
   ```typescript
   // Dismiss an insight
   Response: { success: boolean }
   ```

4. **GET /api/v1/coach/articles**
   ```typescript
   // Get knowledge base articles
   Query: { category?: string, search?: string }
   Response: { articles: Article[] }
   ```

5. **GET /api/v1/coach/articles/:id**
   ```typescript
   // Get full article content
   Response: {
     article: Article,
     content: string,
     relatedArticles: Article[]
   }
   ```

### AI Integration Example

Replace mock response with real AI call:

```tsx
const handleSendMessage = async (content: string) => {
  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date(),
  }
  setMessages(prev => [...prev, userMessage])

  // Show typing
  setIsLoading(true)

  try {
    const response = await fetch('/api/coach/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: content,
        conversationId: conversationId,
        context: {
          userGoals: userGoals,
          recentActivities: recentActivities,
        }
      }),
    })

    const data = await response.json()

    const aiMessage: Message = {
      id: data.id,
      role: 'assistant',
      content: data.message,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, aiMessage])
  } catch (error) {
    showToast({ type: 'error', title: 'Failed to get response' })
  } finally {
    setIsLoading(false)
  }
}
```

---

## Styling & Theming

### Color Scheme

**Message Roles**:
- User: Blue (#3B82F6)
- Assistant: Gray (#F3F4F6)
- System: Yellow (#FEF3C7)

**Insight Types**:
- Tip: Blue (#DBEAFE)
- Warning: Yellow (#FEF3C7)
- Achievement: Green (#D1FAE5)
- Suggestion: Purple (#F3E8FF)

**Categories**:
- Nutrition: Green (#10B981)
- Fitness: Orange (#FB923C)
- Habits: Blue (#3B82F6)
- Mindset: Purple (#A78BFA)
- Sleep: Indigo (#818CF8)

### Responsive Breakpoints

- **Mobile** (<1024px): Single column, full width
- **Desktop** (≥1024px): Two-column layout (2/3 + 1/3)

---

## Best Practices

1. **Conversation Management**:
   - Store conversation history
   - Implement conversation IDs for multi-session support
   - Clear old conversations after X days

2. **AI Response Handling**:
   - Show typing indicator during API call
   - Handle errors gracefully
   - Implement retry logic
   - Stream responses for long answers

3. **Insights**:
   - Generate based on user data
   - Prioritize by relevance
   - Don't show same insight twice
   - Limit to 2-3 per day

4. **Knowledge Base**:
   - Preload popular articles
   - Implement article caching
   - Track reading progress
   - Show related articles

5. **Performance**:
   - Virtualize long message lists
   - Lazy load articles
   - Debounce search input
   - Cache AI responses

---

## Interactive Features

### ChatWindow Interactions

1. **Quick Actions**: Pre-defined prompts for common questions
2. **Enter to Send**: Submit message with Enter key
3. **Auto-scroll**: Automatically scrolls to latest message
4. **Typing Indicator**: Shows when AI is "thinking"

### KnowledgeBase Interactions

1. **Real-time Search**: Instant filtering as user types
2. **Category Tabs**: Filter by health topic
3. **Article Preview**: Hover effects on article cards
4. **Popular Badges**: Highlight trending content

### DailyInsights Interactions

1. **Dismiss**: Remove insight from view
2. **Learn More**: Navigate to detailed article
3. **NEW Badge**: Highlight fresh insights

---

## Component Checklist

- [x] MessageBubble.tsx - Chat message display
- [x] ChatWindow.tsx - Full chat interface
- [x] DailyInsight.tsx - AI insights display
- [x] KnowledgeBase.tsx - Article browser
- [x] index.ts - Component exports
- [x] coach/page.tsx - Integrated page with mock data
- [ ] AI API integration (Phase 3)
- [ ] Conversation persistence
- [ ] Article content viewer
- [ ] Reading progress tracking

---

## Testing the Coach Page

1. **Start the development server**:
   ```bash
   cd apps/web
   npm run dev
   ```

2. **Navigate to Coach page**:
   ```
   http://localhost:3000/coach
   ```

3. **Test interactions**:
   - Send messages in chat (try keywords: "workout", "meal", "sleep", "motivation")
   - Click quick action buttons
   - Dismiss insights
   - Search articles in knowledge base
   - Filter articles by category
   - Verify typing indicator appears
   - Check auto-scroll behavior

4. **Verify components**:
   - ✅ ChatWindow displays with welcome message
   - ✅ MessageBubbles show with correct styling
   - ✅ DailyInsights display at top
   - ✅ KnowledgeBase shows 6 articles
   - ✅ Quick actions work
   - ✅ Search and filter work correctly

---

## Troubleshooting

### Messages Not Displaying

**Issue**: Messages array is empty or undefined
**Fix**: Ensure `initialMessages` is properly set in state

### Typing Indicator Stuck

**Issue**: Loading state not cleared
**Fix**: Always set `isLoading(false)` in finally block

### Search Not Working

**Issue**: Filter logic case sensitivity
**Fix**: Use `.toLowerCase()` for both query and content

### Auto-scroll Issues

**Issue**: Not scrolling to bottom
**Fix**: Ensure `messagesEndRef` is attached to div at end of messages

---

## Advanced Features (Future)

1. **Voice Input**: Add speech-to-text for messages
2. **Message Reactions**: Like/dislike AI responses
3. **Conversation Export**: Download chat history
4. **Multi-language**: Support for multiple languages
5. **Code Snippets**: Syntax highlighting for workout/meal plans
6. **Image Analysis**: Upload food photos for nutritional analysis
7. **Scheduled Insights**: Daily notification system
8. **Bookmarks**: Save favorite articles
9. **Reading Lists**: Create custom article collections
10. **AI Coaching Plans**: Generate multi-week programs

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [React Chat UI Patterns](https://react-chatbotify.com/)
- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Project architecture
- [FOCUS_COMPONENTS_GUIDE.md](./FOCUS_COMPONENTS_GUIDE.md) - Focus components
- [JOURNEY_COMPONENTS_GUIDE.md](./JOURNEY_COMPONENTS_GUIDE.md) - Journey components

---

**Last Updated**: Phase 2 - UI Components (Week 1)
**Status**: ✅ Complete
**Next Phase**: You (Profile) Components
