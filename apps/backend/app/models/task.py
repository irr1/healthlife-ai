from datetime import date
from typing import Optional
from sqlalchemy import String, Text, ForeignKey, Date, Enum as SQLEnum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.db.base_class import Base, TimestampMixin


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    SKIPPED = "skipped"


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TimeOfDay(str, enum.Enum):
    MORNING = "morning"
    AFTERNOON = "afternoon"
    EVENING = "evening"
    ANYTIME = "anytime"


class Task(Base, TimestampMixin):
    """Task model for daily activities and goals"""

    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id", ondelete="CASCADE"), nullable=False, index=True)

    # Task details
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    # Task metadata
    status: Mapped[TaskStatus] = mapped_column(
        SQLEnum(TaskStatus),
        default=TaskStatus.PENDING,
        nullable=False
    )
    priority: Mapped[TaskPriority] = mapped_column(
        SQLEnum(TaskPriority),
        default=TaskPriority.MEDIUM,
        nullable=False
    )

    # Scheduling
    scheduled_date: Mapped[Optional[date]] = mapped_column(Date, index=True)
    time_of_day: Mapped[Optional[TimeOfDay]] = mapped_column(SQLEnum(TimeOfDay))
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer)  # Estimated duration

    # Completion tracking
    completed_at: Mapped[Optional[date]] = mapped_column(Date)
    notes: Mapped[Optional[str]] = mapped_column(Text)  # User notes after completion

    # Relationships
    plan: Mapped["Plan"] = relationship("Plan", back_populates="tasks")

    def __repr__(self) -> str:
        return f"<Task(id={self.id}, title='{self.title}', status='{self.status}')>"
