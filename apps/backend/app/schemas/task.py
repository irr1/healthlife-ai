from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from app.models.task import TaskStatus, TaskPriority, TimeOfDay


# Properties to receive via API on creation
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    scheduled_date: Optional[date] = None
    time_of_day: Optional[TimeOfDay] = None
    duration_minutes: Optional[int] = Field(None, gt=0, le=1440)


# Properties to receive via API on update
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    scheduled_date: Optional[date] = None
    time_of_day: Optional[TimeOfDay] = None
    duration_minutes: Optional[int] = Field(None, gt=0, le=1440)
    notes: Optional[str] = None


# Properties for logging task completion
class TaskLog(BaseModel):
    notes: Optional[str] = Field(None, description="Notes about task completion")


# Properties shared by models stored in DB
class TaskInDBBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    plan_id: int
    title: str
    description: Optional[str] = None
    status: TaskStatus
    priority: TaskPriority
    scheduled_date: Optional[date] = None
    time_of_day: Optional[TimeOfDay] = None
    duration_minutes: Optional[int] = None
    completed_at: Optional[date] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# Properties to return to client
class Task(TaskInDBBase):
    pass


# Properties stored in DB
class TaskInDB(TaskInDBBase):
    pass
