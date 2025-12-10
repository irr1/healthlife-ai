from datetime import datetime, date
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


# Body battery / energy tracking
class EnergyDataPoint(BaseModel):
    date: date
    time: str = Field(..., description="Time of measurement (HH:MM)")
    energy_level: float = Field(..., ge=0, le=10, description="Energy level 0-10")
    activity: Optional[str] = Field(None, description="Associated activity")


class BodyBatteryChart(BaseModel):
    data_points: List[EnergyDataPoint]
    average_energy: float = Field(..., ge=0, le=10)
    peak_time: str = Field(..., description="Time of day with highest energy")
    low_time: str = Field(..., description="Time of day with lowest energy")
    trends: List[str] = Field(default_factory=list, description="Identified trends")


# Habits tracking
class HabitDay(BaseModel):
    date: date
    completed: bool
    notes: Optional[str] = None


class HabitGrid(BaseModel):
    habit_name: str
    days: List[HabitDay]
    streak: int = Field(..., description="Current streak in days")
    completion_rate: float = Field(..., ge=0, le=100, description="Completion percentage")


class HabitsAnalytics(BaseModel):
    habits: List[HabitGrid]
    overall_completion: float = Field(..., ge=0, le=100)
    best_habit: Optional[str] = None
    improvement_area: Optional[str] = None


# Correlations (Pro feature)
class Correlation(BaseModel):
    variable_x: str = Field(..., description="First variable")
    variable_y: str = Field(..., description="Second variable")
    correlation_coefficient: float = Field(..., ge=-1, le=1)
    strength: str = Field(..., pattern="^(weak|moderate|strong)$")
    direction: str = Field(..., pattern="^(positive|negative)$")
    insight: str = Field(..., description="Human-readable insight")


class CorrelationsAnalytics(BaseModel):
    correlations: List[Correlation]
    recommendations: List[str] = Field(default_factory=list)
    requires_pro: bool = True
