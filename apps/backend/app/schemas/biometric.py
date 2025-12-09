from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from app.models.biometric import BiometricType


# Properties to receive via API on creation
class BiometricCreate(BaseModel):
    type: BiometricType = Field(..., description="Type of biometric measurement")
    value: float = Field(..., gt=0, description="Measurement value")
    unit: str = Field(..., description="Unit of measurement (e.g., 'kg', 'cm', '%', 'bpm')")
    notes: Optional[str] = Field(None, description="Optional notes about the measurement")
    measured_at: Optional[datetime] = Field(None, description="When the measurement was taken")


# Properties to receive via API on update
class BiometricUpdate(BaseModel):
    value: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = None
    notes: Optional[str] = None
    measured_at: Optional[datetime] = None


# Properties shared by models stored in DB
class BiometricInDBBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    metric_type: BiometricType
    value: float
    unit: Optional[str] = None
    notes: Optional[str] = None
    measurement_date: date
    created_at: datetime
    updated_at: datetime


# Properties to return to client
class Biometric(BiometricInDBBase):
    pass


# Properties stored in DB
class BiometricInDB(BiometricInDBBase):
    pass
