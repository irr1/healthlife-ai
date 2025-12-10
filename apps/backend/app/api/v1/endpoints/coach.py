from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime
import random

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.coach import (
    ChatMessage,
    ChatResponse,
    DailyInsight,
    KnowledgeQuery,
    KnowledgeArticle,
    PlanAdjustment,
    PlanAdjustmentResponse
)

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_with_coach(
    message: ChatMessage,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> ChatResponse:
    """
    Chat with AI health coach (stub)

    Send a message to the AI coach and receive personalized advice.
    This is a stub endpoint - in production, this would integrate with OpenAI/Claude API.

    - **message**: User's message
    - **context**: Optional context for the conversation

    Returns coach's response with suggestions
    """
    # Stub responses - in production, call OpenAI/Claude API
    stub_responses = [
        "That's a great question! Based on your current goals, I recommend focusing on consistency rather than intensity.",
        "I understand your concern. Let's break this down into smaller, manageable steps.",
        "Excellent progress! Your dedication is paying off. Have you considered tracking your energy levels?",
        "That's completely normal. Many people experience similar challenges. What matters is how you respond to them.",
    ]

    stub_suggestions = [
        "How can I improve my morning routine?",
        "What should I track to measure progress?",
        "Can you adjust my plan based on my feedback?",
        "Tell me more about habit formation"
    ]

    return ChatResponse(
        response=random.choice(stub_responses),
        suggestions=random.sample(stub_suggestions, 3),
        timestamp=datetime.utcnow()
    )


@router.get("/insight", response_model=DailyInsight)
async def get_daily_insight(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> DailyInsight:
    """
    Get daily insight from AI coach (stub)

    Receive a personalized daily insight based on your progress and goals.
    This is a stub endpoint - in production, this would be AI-generated based on user data.

    Returns daily insight with actionable recommendations
    """
    # Stub insights - in production, generate based on user data
    stub_insights = [
        {
            "title": "The Power of Small Wins",
            "message": "Research shows that celebrating small victories increases motivation by 31%. Your streak of 5 days is worth celebrating!",
            "category": "motivation",
            "action_items": [
                "Log your daily wins in the app",
                "Share your progress with accountability partner",
                "Reward yourself for consistency"
            ]
        },
        {
            "title": "Recovery is Progress",
            "message": "You've been pushing hard this week. Remember: rest is when your body adapts and grows stronger.",
            "category": "health",
            "action_items": [
                "Schedule a rest day this week",
                "Aim for 7-8 hours of sleep tonight",
                "Try a gentle stretching session"
            ]
        },
        {
            "title": "Habit Stacking for Success",
            "message": "Attach new habits to existing ones. Your morning coffee could be the perfect trigger for a 5-minute meditation.",
            "category": "habit",
            "action_items": [
                "Identify your strongest existing habits",
                "Choose one new habit to stack",
                "Practice for 7 days to build the connection"
            ]
        }
    ]

    insight_data = random.choice(stub_insights)

    return DailyInsight(
        title=insight_data["title"],
        message=insight_data["message"],
        category=insight_data["category"],
        action_items=insight_data["action_items"],
        created_at=datetime.utcnow()
    )


@router.get("/knowledge", response_model=List[KnowledgeArticle])
async def search_knowledge_base(
    query: str,
    category: str = None,
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> List[KnowledgeArticle]:
    """
    Search health knowledge base (stub)

    Search for health and wellness articles in the knowledge base.
    This is a stub endpoint - in production, this would search a vector database.

    Query parameters:
    - **query**: Search query
    - **category**: Optional category filter
    - **limit**: Maximum number of results (default: 5)

    Returns list of relevant articles with relevance scores
    """
    # Stub knowledge articles - in production, use vector search
    stub_articles = [
        KnowledgeArticle(
            title="Building Sustainable Habits",
            summary="Learn how to create habits that last using the habit loop framework.",
            content="The habit loop consists of three parts: cue, routine, and reward. Understanding this framework helps you design sustainable habits...",
            category="habits",
            tags=["habits", "behavior-change", "psychology"],
            relevance_score=0.95
        ),
        KnowledgeArticle(
            title="Nutrition Fundamentals",
            summary="Essential guide to balanced nutrition and meal planning.",
            content="A balanced diet includes macronutrients (protein, carbs, fats) and micronutrients (vitamins, minerals)...",
            category="nutrition",
            tags=["nutrition", "health", "diet"],
            relevance_score=0.87
        ),
        KnowledgeArticle(
            title="Recovery and Sleep Optimization",
            summary="Maximize your recovery through quality sleep and rest strategies.",
            content="Sleep is crucial for muscle recovery, cognitive function, and overall health. Aim for 7-9 hours...",
            category="recovery",
            tags=["sleep", "recovery", "health"],
            relevance_score=0.82
        ),
        KnowledgeArticle(
            title="Stress Management Techniques",
            summary="Evidence-based approaches to managing stress and anxiety.",
            content="Chronic stress affects both mental and physical health. Key techniques include mindfulness, breathing exercises...",
            category="mental-health",
            tags=["stress", "mental-health", "wellness"],
            relevance_score=0.78
        ),
        KnowledgeArticle(
            title="Goal Setting Framework",
            summary="Set and achieve meaningful health goals using SMART criteria.",
            content="SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound...",
            category="productivity",
            tags=["goals", "productivity", "success"],
            relevance_score=0.75
        )
    ]

    # Filter by category if provided
    if category:
        stub_articles = [a for a in stub_articles if a.category == category]

    # Return top results
    return stub_articles[:limit]


@router.post("/adjust-plan", response_model=PlanAdjustmentResponse)
async def adjust_plan(
    adjustment: PlanAdjustment,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> PlanAdjustmentResponse:
    """
    Request plan adjustment (stub)

    Request changes to your current plan based on feedback and needs.
    This is a stub endpoint - in production, this would trigger plan regeneration.

    - **reason**: Reason for requesting adjustment
    - **changes**: List of requested changes
    - **priority**: Priority level (low/medium/high)

    Returns confirmation and applied changes
    """
    # Stub response - in production, trigger plan regeneration
    # and save user feedback for AI training

    return PlanAdjustmentResponse(
        message=f"Thank you for your feedback! Your adjustment request has been received and will be processed.",
        adjusted=False,  # Set to True when plan is actually regenerated
        new_plan_id=None,
        changes_applied=[
            "Feedback logged for analysis",
            "Coach will review your request",
            "You'll be notified when adjustments are ready"
        ]
    )
