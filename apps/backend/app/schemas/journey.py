from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


# Milestone schema
class Milestone(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    target_date: date
    completed: bool = False
    completed_at: Optional[datetime] = None


# Weekly review schema
class WeeklyReviewCreate(BaseModel):
    week_number: int = Field(..., ge=1, le=53)
    wins: List[str] = Field(..., description="Weekly achievements")
    challenges: List[str] = Field(..., description="Challenges faced")
    lessons: List[str] = Field(..., description="Lessons learned")
    energy_average: float = Field(..., ge=0, le=10, description="Average energy level")
    notes: Optional[str] = None


class WeeklyReview(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    week_number: int
    wins: List[str]
    challenges: List[str]
    lessons: List[str]
    energy_average: float
    notes: Optional[str] = None
    created_at: datetime


# Progress schema
class Progress(BaseModel):
    overall_completion: float = Field(..., ge=0, le=100, description="Overall progress percentage")
    current_phase: int = Field(..., description="Current phase index")
    total_phases: int = Field(..., description="Total number of phases")
    tasks_completed: int
    tasks_total: int
    streak_days: int = Field(..., description="Current streak in days")
    milestones_reached: int
    milestones_total: int
