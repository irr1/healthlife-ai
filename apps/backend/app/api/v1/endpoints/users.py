from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User as UserModel
from app.models.biometric import Biometric, BiometricType
from app.schemas.user import User, UserUpdate
from app.schemas.biometric import BiometricCreate, Biometric as BiometricSchema
from app.crud import user as crud_user
from sqlalchemy import select, func

router = APIRouter()


@router.get("/me", response_model=User)
async def get_user_profile(
    current_user: UserModel = Depends(get_current_user)
) -> User:
    """
    Get current user profile

    Returns complete user profile including all fields
    """
    return current_user


@router.patch("/me", response_model=User)
async def update_user_profile(
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> User:
    """
    Update current user profile

    - **full_name**: Optional full name
    - **age**: Optional age
    - **gender**: Optional gender (male/female/other)
    - **height**: Optional height in cm
    - **current_weight**: Optional current weight in kg
    - **goal_weight**: Optional goal weight in kg
    - **activity_level**: Optional activity level (sedentary/light/moderate/active/very_active)
    - **goals**: Optional list of health goals
    - **password**: Optional new password

    Returns updated user profile
    """
    updated_user = await crud_user.update_user(db, current_user.id, user_in)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    await db.commit()
    await db.refresh(updated_user)

    return updated_user


@router.post("/me/biometrics", response_model=BiometricSchema, status_code=status.HTTP_201_CREATED)
async def add_biometric(
    biometric_in: BiometricCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> BiometricSchema:
    """
    Add biometric measurement

    - **type**: Biometric type (weight/height/body_fat/muscle_mass/water_percentage/bmi/other)
    - **value**: Measurement value
    - **unit**: Unit of measurement (e.g., "kg", "cm", "%")
    - **notes**: Optional notes

    Returns created biometric record
    """
    db_biometric = Biometric(
        user_id=current_user.id,
        metric_type=biometric_in.type,
        value=biometric_in.value,
        unit=biometric_in.unit,
        notes=biometric_in.notes,
        measurement_date=biometric_in.measured_at.date() if biometric_in.measured_at else datetime.utcnow().date()
    )

    db.add(db_biometric)
    await db.commit()
    await db.refresh(db_biometric)

    return db_biometric


@router.get("/me/stats", response_model=Dict[str, Any])
async def get_user_stats(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get user statistics

    Returns:
    - **profile_completion**: Percentage of profile completion
    - **biometrics_count**: Total number of biometric measurements
    - **latest_biometrics**: Latest measurements by type
    - **weight_progress**: Weight change over last 30 days (if available)
    - **plans_count**: Total number of plans
    - **active_plan**: Whether user has an active plan
    """
    # Calculate profile completion
    profile_fields = [
        current_user.full_name,
        current_user.age,
        current_user.gender,
        current_user.height,
        current_user.current_weight,
        current_user.goal_weight,
        current_user.activity_level,
        current_user.goals
    ]
    completed_fields = sum(1 for field in profile_fields if field is not None)
    profile_completion = (completed_fields / len(profile_fields)) * 100

    # Get biometrics count
    biometrics_count_query = select(func.count(Biometric.id)).where(
        Biometric.user_id == current_user.id
    )
    biometrics_count_result = await db.execute(biometrics_count_query)
    biometrics_count = biometrics_count_result.scalar_one()

    # Get latest biometrics by type
    latest_biometrics = {}
    for biometric_type in BiometricType:
        query = select(Biometric).where(
            Biometric.user_id == current_user.id,
            Biometric.metric_type == biometric_type
        ).order_by(Biometric.measurement_date.desc()).limit(1)

        result = await db.execute(query)
        biometric = result.scalar_one_or_none()

        if biometric:
            latest_biometrics[biometric_type.value] = {
                "value": biometric.value,
                "unit": biometric.unit,
                "measurement_date": biometric.measurement_date.isoformat()
            }

    # Calculate weight progress (last 30 days)
    weight_progress = None
    thirty_days_ago = datetime.utcnow().date() - timedelta(days=30)

    weight_query = select(Biometric).where(
        Biometric.user_id == current_user.id,
        Biometric.metric_type == BiometricType.WEIGHT,
        Biometric.measurement_date >= thirty_days_ago
    ).order_by(Biometric.measurement_date.asc())

    weight_result = await db.execute(weight_query)
    weight_measurements = weight_result.scalars().all()

    if len(weight_measurements) >= 2:
        first_weight = weight_measurements[0].value
        latest_weight = weight_measurements[-1].value
        weight_change = latest_weight - first_weight
        weight_progress = {
            "change": round(weight_change, 2),
            "unit": "kg",
            "start_date": weight_measurements[0].measurement_date.isoformat(),
            "end_date": weight_measurements[-1].measurement_date.isoformat(),
            "percentage": round((weight_change / first_weight) * 100, 2) if first_weight != 0 else 0
        }

    # Get plans count (will be implemented later)
    plans_count = len(current_user.plans) if hasattr(current_user, 'plans') else 0
    active_plan = any(plan.is_active for plan in current_user.plans) if hasattr(current_user, 'plans') and current_user.plans else False

    return {
        "profile_completion": round(profile_completion, 2),
        "biometrics_count": biometrics_count,
        "latest_biometrics": latest_biometrics,
        "weight_progress": weight_progress,
        "plans_count": plans_count,
        "active_plan": active_plan
    }
