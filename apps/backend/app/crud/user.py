from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import json

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    """Get user by ID"""
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """Get user by email"""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
    """
    Create new user

    Args:
        db: Database session
        user_in: User creation schema

    Returns:
        Created user
    """
    # Convert goals list to JSON string if provided
    goals_json = json.dumps(user_in.goals) if user_in.goals else None

    db_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        age=user_in.age,
        gender=user_in.gender,
        height=user_in.height,
        current_weight=user_in.current_weight,
        goal_weight=user_in.goal_weight,
        activity_level=user_in.activity_level,
        goals=goals_json,
        is_active=user_in.is_active,
    )

    db.add(db_user)
    await db.flush()
    await db.refresh(db_user)

    return db_user


async def update_user(db: AsyncSession, user_id: int, user_in: UserUpdate) -> Optional[User]:
    """
    Update user

    Args:
        db: Database session
        user_id: User ID to update
        user_in: User update schema

    Returns:
        Updated user or None if not found
    """
    db_user = await get_user_by_id(db, user_id)
    if not db_user:
        return None

    update_data = user_in.model_dump(exclude_unset=True)

    # Hash password if it's being updated
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    # Convert goals list to JSON string if provided
    if "goals" in update_data and update_data["goals"] is not None:
        update_data["goals"] = json.dumps(update_data["goals"])

    for field, value in update_data.items():
        setattr(db_user, field, value)

    await db.flush()
    await db.refresh(db_user)

    return db_user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
    """
    Authenticate user by email and password

    Args:
        db: Database session
        email: User email
        password: Plain text password

    Returns:
        User if authentication successful, None otherwise
    """
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        return None
    return user
