from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.plan import Plan, PlanCreate
from app.crud import plan as crud_plan

router = APIRouter()


@router.post("/generate", response_model=Plan, status_code=status.HTTP_201_CREATED)
async def generate_plan(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> Plan:
    """
    Generate a new personalized health plan (stub)

    This is a stub endpoint that creates a basic plan structure.
    In production, this would call an AI service to generate a personalized roadmap
    based on user's profile, goals, and health data.

    Returns newly generated plan
    """
    # Deactivate all existing plans
    await crud_plan.deactivate_user_plans(db, current_user.id)

    # Create stub plan
    # TODO: Replace with AI-generated plan based on user profile
    stub_roadmap = {
        "phases": [
            {
                "name": "Foundation Phase",
                "duration": "2 weeks",
                "goals": ["Establish baseline habits", "Track current metrics"],
                "milestones": ["Complete daily tracking for 14 days", "First biometric measurements"]
            },
            {
                "name": "Progress Phase",
                "duration": "4 weeks",
                "goals": ["Build sustainable habits", "See measurable progress"],
                "milestones": ["10% progress toward goal", "Consistent weekly tracking"]
            },
            {
                "name": "Optimization Phase",
                "duration": "6 weeks",
                "goals": ["Fine-tune approach", "Accelerate results"],
                "milestones": ["50% progress toward goal", "Habit consistency above 80%"]
            }
        ],
        "timeline": {
            "total_duration": "12 weeks",
            "estimated_completion": "Based on current progress rate"
        }
    }

    plan_in = PlanCreate(
        title="Your Personalized Health Journey",
        description="A customized plan to help you achieve your health goals",
        roadmap=stub_roadmap
    )

    db_plan = await crud_plan.create_plan(db, current_user.id, plan_in)
    await db.commit()
    await db.refresh(db_plan)

    return db_plan


@router.get("/current", response_model=Plan)
async def get_current_plan(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> Plan:
    """
    Get current active plan

    Returns the user's currently active health plan
    """
    plan = await crud_plan.get_active_plan(db, current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active plan found. Generate a new plan first."
        )

    return plan


@router.post("/regenerate", response_model=Plan)
async def regenerate_plan(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> Plan:
    """
    Regenerate plan based on current progress

    Deactivates current plan and generates a new one based on:
    - Current progress and metrics
    - Updated user profile
    - Historical data and patterns

    Returns newly regenerated plan
    """
    # Deactivate all existing plans
    await crud_plan.deactivate_user_plans(db, current_user.id)

    # In production, this would analyze user's progress and generate optimized plan
    # For now, create a stub regenerated plan
    stub_roadmap = {
        "phases": [
            {
                "name": "Accelerated Phase",
                "duration": "3 weeks",
                "goals": ["Build on existing progress", "Increase intensity"],
                "milestones": ["Maintain current habits", "Increase activity by 20%"]
            },
            {
                "name": "Breakthrough Phase",
                "duration": "5 weeks",
                "goals": ["Push past plateau", "Achieve significant progress"],
                "milestones": ["75% progress toward goal", "New personal bests"]
            }
        ],
        "timeline": {
            "total_duration": "8 weeks",
            "estimated_completion": "Based on improved progress rate"
        }
    }

    plan_in = PlanCreate(
        title="Your Regenerated Health Journey",
        description="An updated plan optimized based on your progress",
        roadmap=stub_roadmap
    )

    db_plan = await crud_plan.create_plan(db, current_user.id, plan_in)
    await db.commit()
    await db.refresh(db_plan)

    return db_plan


@router.get("/roadmap", response_model=Dict[str, Any])
async def get_plan_roadmap(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get detailed roadmap for current plan

    Returns:
    - **phases**: List of plan phases with goals and milestones
    - **timeline**: Overall timeline information
    - **current_phase**: Current phase index
    - **completion**: Overall completion percentage
    """
    plan = await crud_plan.get_active_plan(db, current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active plan found. Generate a new plan first."
        )

    if not plan.roadmap:
        return {
            "phases": [],
            "timeline": {},
            "current_phase": 0,
            "completion": 0.0
        }

    return {
        "phases": plan.roadmap.get("phases", []),
        "timeline": plan.roadmap.get("timeline", {}),
        "current_phase": plan.current_phase,
        "completion": plan.completion_percentage
    }
