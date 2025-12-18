"""
Daily Metrics Model

Stores daily health and performance metrics for users:
- Energy levels (Body Battery)
- Sleep hours
- Mood/Stress
- Weight tracking
- Custom notes
"""

from datetime import date, datetime
from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class DailyMetric(Base):
    """
    Daily metrics for tracking user's health and performance

    Body Battery calculation:
    - Base energy starts at previous day's level (default 50)
    - Sleep adds: hours_slept * 10 (max +80 for 8h)
    - Exercise adds: moderate activity +10, intense +5 (recovery cost)
    - Stress subtracts: high stress -20, medium -10
    - Result clamped between 0-100
    """
    __tablename__ = "daily_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)

    # Energy / Body Battery (0-100)
    energy_level = Column(Integer, nullable=True)  # User reported or calculated

    # Sleep tracking
    hours_slept = Column(Float, nullable=True)  # Hours of sleep
    sleep_quality = Column(Integer, nullable=True)  # 1-10 scale

    # Mood and stress
    mood = Column(Integer, nullable=True)  # 1-10 scale (1=terrible, 10=amazing)
    stress_level = Column(Integer, nullable=True)  # 1-10 scale (1=calm, 10=very stressed)

    # Body metrics
    weight = Column(Float, nullable=True)  # kg

    # Activity summary (calculated from tasks)
    tasks_completed = Column(Integer, default=0)
    exercise_minutes = Column(Integer, default=0)

    # Notes
    notes = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="daily_metrics")

    def __repr__(self):
        return f"<DailyMetric(user_id={self.user_id}, date={self.date}, energy={self.energy_level})>"
