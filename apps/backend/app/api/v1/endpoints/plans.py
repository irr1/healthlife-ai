from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from datetime import date, timedelta

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User as UserModel
from app.models.task import TaskPriority, TimeOfDay
from app.schemas.plan import Plan, PlanCreate
from app.schemas.task import TaskCreate
from app.crud import plan as crud_plan
from app.crud import task as crud_task
from app.services.openai_service import generate_health_plan

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

    # Prepare user data for AI plan generation
    user_data = {
        "age": current_user.age,
        "gender": current_user.gender,
        "current_weight": current_user.current_weight,
        "goal_weight": current_user.goal_weight,
        "height": current_user.height,
        "activity_level": current_user.activity_level,
        "goals": current_user.goals
    }

    # Generate AI-powered roadmap using OpenAI
    ai_roadmap = generate_health_plan(user_data, current_user.goals)

    plan_in = PlanCreate(
        title="Your Personalized Health Journey",
        description="An AI-generated plan tailored to your goals and fitness level",
        roadmap=ai_roadmap
    )

    db_plan = await crud_plan.create_plan(db, current_user.id, plan_in)
    await db.flush()

    # Generate initial tasks for the current week
    # Use today + 1 day to ensure tasks are always visible (handles timezone issues)
    today = date.today()
    start_date = today  # Start from today

    sample_tasks = [
        # Day 1 (Today)
        TaskCreate(
            title="Morning Workout",
            description="30-minute cardio session to kickstart your day",
            priority=TaskPriority.HIGH,
            scheduled_date=start_date,
            time_of_day=TimeOfDay.MORNING,
            duration_minutes=30
        ),
        TaskCreate(
            title="Track Your Meals",
            description="Log all meals and snacks in your food diary",
            priority=TaskPriority.MEDIUM,
            scheduled_date=start_date,
            time_of_day=TimeOfDay.ANYTIME,
            duration_minutes=10
        ),
        TaskCreate(
            title="Evening Stretching",
            description="15-minute stretching routine before bed",
            priority=TaskPriority.MEDIUM,
            scheduled_date=start_date,
            time_of_day=TimeOfDay.EVENING,
            duration_minutes=15
        ),
        # Day 2
        TaskCreate(
            title="Morning Hydration",
            description="Drink 500ml of water first thing in the morning",
            priority=TaskPriority.HIGH,
            scheduled_date=start_date + timedelta(days=1),
            time_of_day=TimeOfDay.MORNING,
            duration_minutes=5
        ),
        TaskCreate(
            title="Healthy Lunch Prep",
            description="Prepare a balanced lunch with protein and vegetables",
            priority=TaskPriority.MEDIUM,
            scheduled_date=start_date + timedelta(days=1),
            time_of_day=TimeOfDay.AFTERNOON,
            duration_minutes=20
        ),
        # Day 3
        TaskCreate(
            title="Yoga Session",
            description="20-minute yoga for flexibility and mindfulness",
            priority=TaskPriority.MEDIUM,
            scheduled_date=start_date + timedelta(days=2),
            time_of_day=TimeOfDay.MORNING,
            duration_minutes=20
        ),
        TaskCreate(
            title="Healthy Dinner",
            description="Cook a nutritious dinner with vegetables and lean protein",
            priority=TaskPriority.MEDIUM,
            scheduled_date=start_date + timedelta(days=2),
            time_of_day=TimeOfDay.EVENING,
            duration_minutes=30
        ),
    ]

    # Create all tasks
    for task_data in sample_tasks:
        await crud_task.create_task(db, db_plan.id, task_data)

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
