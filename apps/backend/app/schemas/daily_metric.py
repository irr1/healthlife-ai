"""
Daily Metric Schemas

Pydantic models for daily metrics validation and serialization
"""

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class DailyMetricBase(BaseModel):
    """Base schema for daily metrics"""
    date: date
    energy_level: Optional[int] = Field(None, ge=0, le=100, description="Energy level 0-100")
    hours_slept: Optional[float] = Field(None, ge=0, le=24, description="Hours of sleep")
    sleep_quality: Optional[int] = Field(None, ge=1, le=10, description="Sleep quality 1-10")
    mood: Optional[int] = Field(None, ge=1, le=10, description="Mood 1-10")
    stress_level: Optional[int] = Field(None, ge=1, le=10, description="Stress level 1-10")
    weight: Optional[float] = Field(None, gt=0, description="Weight in kg")
    notes: Optional[str] = Field(None, max_length=500)


class DailyMetricCreate(DailyMetricBase):
    """Schema for creating daily metric"""
    pass


class DailyMetricUpdate(BaseModel):
    """Schema for updating daily metric (all fields optional)"""
    energy_level: Optional[int] = Field(None, ge=0, le=100)
    hours_slept: Optional[float] = Field(None, ge=0, le=24)
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    mood: Optional[int] = Field(None, ge=1, le=10)
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    weight: Optional[float] = Field(None, gt=0)
    notes: Optional[str] = Field(None, max_length=500)


class DailyMetric(DailyMetricBase):
    """Schema for daily metric response"""
    id: int
    user_id: int
    tasks_completed: int = 0
    exercise_minutes: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BodyBatteryResponse(BaseModel):
    """Response for body battery calculation"""
    current_energy: int = Field(..., ge=0, le=100, description="Current energy level")
    trend: str = Field(..., description="Trend: 'increasing', 'stable', 'decreasing'")
    prediction_tomorrow: int = Field(..., ge=0, le=100, description="Predicted energy for tomorrow")
    advice: str = Field(..., description="Personalized advice based on current state")


class EnergyHistoryResponse(BaseModel):
    """Response for energy history (7 days)"""
    date: date
    energy_level: Optional[int] = None
    tasks_completed: int = 0
    hours_slept: Optional[float] = None

    class Config:
        from_attributes = True
