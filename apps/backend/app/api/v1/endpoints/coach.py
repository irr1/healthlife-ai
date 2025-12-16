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
from app.services.openai_service import chat_with_coach as ai_chat, generate_daily_insight

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_with_coach(
    message: ChatMessage,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> ChatResponse:
    """
    Chat with AI health coach

    Send a message to the AI coach and receive personalized advice powered by OpenAI.

    - **message**: User's message
    - **context**: Optional context for the conversation

    Returns coach's response with suggestions
    """
    # Prepare user context for AI
    user_context = {
        "goals": current_user.goals,
        "activity_level": current_user.activity_level,
        "age": current_user.age,
        "gender": current_user.gender
    }

    # Call OpenAI service
    ai_response = ai_chat(
        message=message.message,
        user_context=user_context,
        conversation_history=None  # Could store conversation history in future
    )

    return ChatResponse(
        response=ai_response["response"],
        suggestions=ai_response["suggestions"],
        timestamp=datetime.utcnow()
    )


@router.get("/insight", response_model=DailyInsight)
async def get_daily_insight(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> DailyInsight:
    """
    Get daily insight from AI coach

    Receive a personalized daily insight based on your progress and goals, powered by OpenAI.

    Returns daily insight with actionable recommendations
    """
    # Prepare user data for AI insight generation
    user_data = {
        "goals": current_user.goals,
        "activity_level": current_user.activity_level,
        "recent_activity": "tracking daily tasks"  # Could be enhanced with real activity data
    }

    # Generate AI-powered insight
    ai_message = generate_daily_insight(user_data)

    # Return insight with some default action items
    # In future, these could also be AI-generated
    insight_data = {
        "title": "Today's Insight",
        "message": ai_message,
        "category": "motivation",
        "action_items": [
            "Focus on completing one task at a time",
            "Track your progress in the app",
            "Celebrate small wins along the way"
        ]
    }

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
