from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


# Properties to receive via API on creation
class PlanCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    roadmap: Optional[Dict[str, Any]] = None


# Properties to receive via API on update
class PlanUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    roadmap: Optional[Dict[str, Any]] = None
    current_phase: Optional[int] = Field(None, ge=0)
    completion_percentage: Optional[float] = Field(None, ge=0, le=100)
    is_active: Optional[bool] = None


# Properties shared by models stored in DB
class PlanInDBBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    roadmap: Optional[Dict[str, Any]] = None
    current_phase: int
    completion_percentage: float
    is_active: bool
    created_at: datetime
    updated_at: datetime


# Properties to return to client
class Plan(PlanInDBBase):
    pass


# Properties stored in DB
class PlanInDB(PlanInDBBase):
    pass
