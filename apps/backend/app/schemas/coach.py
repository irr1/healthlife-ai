from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# Chat message schemas
class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    context: Optional[str] = Field(None, description="Optional context for the message")


class ChatResponse(BaseModel):
    response: str = Field(..., description="Coach's response")
    suggestions: List[str] = Field(default_factory=list, description="Suggested follow-up questions")
    timestamp: datetime


# Insight schema
class DailyInsight(BaseModel):
    title: str
    message: str
    category: str = Field(..., description="Category: motivation, health, habit, etc.")
    action_items: List[str] = Field(default_factory=list)
    created_at: datetime


# Knowledge base schema
class KnowledgeQuery(BaseModel):
    query: str = Field(..., min_length=1, description="Search query")
    category: Optional[str] = Field(None, description="Optional category filter")


class KnowledgeArticle(BaseModel):
    title: str
    summary: str
    content: str
    category: str
    tags: List[str] = Field(default_factory=list)
    relevance_score: float = Field(..., ge=0, le=1, description="Relevance to query")


# Plan adjustment schema
class PlanAdjustment(BaseModel):
    reason: str = Field(..., description="Reason for adjustment")
    changes: List[str] = Field(..., description="List of requested changes")
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")


class PlanAdjustmentResponse(BaseModel):
    message: str
    adjusted: bool
    new_plan_id: Optional[int] = None
    changes_applied: List[str] = Field(default_factory=list)
