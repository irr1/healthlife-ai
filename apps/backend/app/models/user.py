from datetime import date
from typing import Optional, List
from sqlalchemy import String, Integer, Float, Date, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.db.base_class import Base, TimestampMixin


class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class ActivityLevel(str, enum.Enum):
    SEDENTARY = "sedentary"  # Little or no exercise
    LIGHT = "light"  # Exercise 1-3 times/week
    MODERATE = "moderate"  # Exercise 4-5 times/week
    ACTIVE = "active"  # Daily exercise or intense exercise 3-4 times/week
    VERY_ACTIVE = "very_active"  # Intense exercise 6-7 times/week


class User(Base, TimestampMixin):
    """User model for authentication and profile"""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    # Profile information
    full_name: Mapped[Optional[str]] = mapped_column(String(255))
    age: Mapped[Optional[int]] = mapped_column(Integer)
    gender: Mapped[Optional[Gender]] = mapped_column(SQLEnum(Gender))
    height: Mapped[Optional[float]] = mapped_column(Float)  # in cm
    date_of_birth: Mapped[Optional[date]] = mapped_column(Date)

    # Health metrics
    current_weight: Mapped[Optional[float]] = mapped_column(Float)  # in kg
    goal_weight: Mapped[Optional[float]] = mapped_column(Float)  # in kg
    activity_level: Mapped[Optional[ActivityLevel]] = mapped_column(SQLEnum(ActivityLevel))

    # Goals (stored as JSON array)
    goals: Mapped[Optional[str]] = mapped_column(String(500))  # JSON string of goals

    # User status
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(default=False, nullable=False)

    # Relationships
    plans: Mapped[List["Plan"]] = relationship(
        "Plan", back_populates="user", cascade="all, delete-orphan"
    )
    biometrics: Mapped[List["Biometric"]] = relationship(
        "Biometric", back_populates="user", cascade="all, delete-orphan"
    )
    daily_metrics: Mapped[List["DailyMetric"]] = relationship(
        "DailyMetric", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email='{self.email}')>"
