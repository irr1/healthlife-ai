from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    age: Optional[int] = Field(None, ge=13, le=120, description="Age must be between 13 and 120")
    gender: Optional[str] = Field(None, pattern="^(male|female|other)$")
    height: Optional[float] = Field(None, gt=0, description="Height in cm")
    current_weight: Optional[float] = Field(None, gt=0, description="Current weight in kg")
    goal_weight: Optional[float] = Field(None, gt=0, description="Goal weight in kg")
    activity_level: Optional[str] = Field(
        None,
        pattern="^(sedentary|light|moderate|active|very_active)$"
    )
    goals: Optional[List[str]] = Field(None, description="List of health goals")


# Properties to receive via API on update
class UserUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    full_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=13, le=120)
    gender: Optional[str] = Field(None, pattern="^(male|female|other)$")
    height: Optional[float] = Field(None, gt=0)
    date_of_birth: Optional[date] = None
    current_weight: Optional[float] = Field(None, gt=0)
    goal_weight: Optional[float] = Field(None, gt=0)
    activity_level: Optional[str] = Field(
        None,
        pattern="^(sedentary|light|moderate|active|very_active)$"
    )
    goals: Optional[List[str]] = None
    is_active: Optional[bool] = None


# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    date_of_birth: Optional[date] = None
    current_weight: Optional[float] = None
    goal_weight: Optional[float] = None
    activity_level: Optional[str] = None
    goals: Optional[str] = None  # JSON string in DB
    is_verified: bool = False
    created_at: datetime
    updated_at: datetime


# Properties to return to client
class User(UserInDBBase):
    pass


# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
