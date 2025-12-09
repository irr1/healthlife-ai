from datetime import date
from typing import Optional
from sqlalchemy import Float, ForeignKey, Date, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.db.base_class import Base, TimestampMixin


class BiometricType(str, enum.Enum):
    WEIGHT = "weight"
    BODY_FAT = "body_fat"
    MUSCLE_MASS = "muscle_mass"
    BMI = "bmi"
    BLOOD_PRESSURE_SYSTOLIC = "blood_pressure_systolic"
    BLOOD_PRESSURE_DIASTOLIC = "blood_pressure_diastolic"
    HEART_RATE = "heart_rate"
    SLEEP_HOURS = "sleep_hours"
    STEPS = "steps"
    WATER_INTAKE = "water_intake"  # in liters
    CALORIES_CONSUMED = "calories_consumed"
    CALORIES_BURNED = "calories_burned"


class Biometric(Base, TimestampMixin):
    """Biometric model for tracking health metrics"""

    __tablename__ = "biometrics"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Biometric data
    metric_type: Mapped[BiometricType] = mapped_column(SQLEnum(BiometricType), nullable=False, index=True)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[Optional[str]] = mapped_column()  # e.g., "kg", "bpm", "hours"

    # Tracking
    measurement_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    notes: Mapped[Optional[str]] = mapped_column()

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="biometrics")

    def __repr__(self) -> str:
        return f"<Biometric(id={self.id}, type='{self.metric_type}', value={self.value}, date={self.measurement_date})>"
