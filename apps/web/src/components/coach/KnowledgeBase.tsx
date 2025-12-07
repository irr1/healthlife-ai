'use client'

import { useState } from 'react'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'

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

const categoryConfig = {
  nutrition: { icon: '🥗', color: 'bg-green-100 text-green-700 border-green-300' },
  fitness: { icon: '💪', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  habits: { icon: '✅', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  mindset: { icon: '🧠', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  sleep: { icon: '😴', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
}

export default function KnowledgeBase({ articles, onArticleClick }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all')

  // Filter articles based on search and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories: (ArticleCategory | 'all')[] = ['all', 'nutrition', 'fitness', 'habits', 'mindset', 'sleep']

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Browse articles and guides to support your health journey
        </p>
      </CardHeader>

      <CardContent>
        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {category === 'all' ? '📚 All' : `${categoryConfig[category].icon} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h4 className="text-lg font-bold text-gray-700 mb-2">No articles found</h4>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <ArticleItem
                key={article.id}
                article={article}
                onClick={() => onArticleClick?.(article.id)}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredArticles.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Showing {filteredArticles.length} of {articles.length} articles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ArticleItemProps {
  article: Article
  onClick: () => void
}

function ArticleItem({ article, onClick }: ArticleItemProps) {
  const config = categoryConfig[article.category]

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-purple-300 transition-all group"
    >
      <div className="flex items-start gap-3">
        {/* Category Icon */}
        <div className={cn('flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl', config.color)}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {article.title}
            </h4>
            {article.isPopular && (
              <span className="flex-shrink-0 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                🔥 Popular
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {article.description}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">⏱️ {article.readTime}</span>
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 text-gray-400 group-hover:text-purple-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}
