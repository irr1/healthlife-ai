from typing import Optional, List
from sqlalchemy import String, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


class Plan(Base, TimestampMixin):
    """Plan model for user's health journey roadmap"""

    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Plan details
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    # AI-generated roadmap (JSON structure)
    # Structure: {phases: [{name, duration, goals, milestones}], timeline: {...}}
    roadmap: Mapped[Optional[dict]] = mapped_column(JSON)

    # Current progress
    current_phase: Mapped[int] = mapped_column(Integer, default=0, nullable=False)  # 0-indexed phase
    completion_percentage: Mapped[float] = mapped_column(default=0.0, nullable=False)

    # Plan status
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="plans")
    tasks: Mapped[List["Task"]] = relationship(
        "Task", back_populates="plan", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Plan(id={self.id}, user_id={self.user_id}, title='{self.title}')>"
