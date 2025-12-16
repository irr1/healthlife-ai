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
from app.services.ai_engine import generate_roadmap, generate_weekly_tasks

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

    # Generate AI-powered roadmap using AI Engine with safety rules
    ai_roadmap = generate_roadmap(user_data, current_user.goals)

    plan_in = PlanCreate(
        title="Your Personalized Health Journey",
        description="An AI-generated plan tailored to your goals and fitness level",
        roadmap=ai_roadmap
    )

    db_plan = await crud_plan.create_plan(db, current_user.id, plan_in)
    await db.flush()

    # Generate initial weekly tasks (7 days) using AI Engine
    today = date.today()
    start_date = today  # Start from today

    # Get first phase for task generation
    first_phase = ai_roadmap.get('phases', [])[0] if ai_roadmap.get('phases') else {
        'name': 'Foundation',
        'goals': ['Establish baseline habits']
    }

    # Generate AI-powered weekly tasks (7 days instead of 3)
    ai_tasks = generate_weekly_tasks(
        user_data=user_data,
        phase=first_phase,
        week_number=1,
        start_date=start_date
    )

    # Convert AI tasks to TaskCreate objects
    task_creates = []
    for task in ai_tasks:
        # Map priority string to enum
        priority_map = {
            'low': TaskPriority.LOW,
            'medium': TaskPriority.MEDIUM,
            'high': TaskPriority.HIGH
        }

        # Map time_of_day string to enum
        time_map = {
            'morning': TimeOfDay.MORNING,
            'afternoon': TimeOfDay.AFTERNOON,
            'evening': TimeOfDay.EVENING,
            'anytime': TimeOfDay.ANYTIME
        }

        task_creates.append(TaskCreate(
            title=task.get('title', 'Health Task'),
            description=task.get('description', ''),
            priority=priority_map.get(task.get('priority', 'medium'), TaskPriority.MEDIUM),
            scheduled_date=task.get('scheduled_date', start_date),
            time_of_day=time_map.get(task.get('time_of_day', 'anytime'), TimeOfDay.ANYTIME),
            duration_minutes=task.get('duration_minutes', 30)
        ))

    # Create all tasks
    for task_data in task_creates:
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

    # Prepare user data for AI plan regeneration
    user_data = {
        "age": current_user.age,
        "gender": current_user.gender,
        "current_weight": current_user.current_weight,
        "goal_weight": current_user.goal_weight,
        "height": current_user.height,
        "activity_level": current_user.activity_level,
        "goals": current_user.goals
    }

    # Generate fresh AI-powered roadmap with safety rules
    ai_roadmap = generate_roadmap(user_data, current_user.goals)

    plan_in = PlanCreate(
        title="Your Regenerated Health Journey",
        description="An updated plan optimized based on your progress",
        roadmap=ai_roadmap
    )

    db_plan = await crud_plan.create_plan(db, current_user.id, plan_in)
    await db.flush()

    # Generate initial weekly tasks for regenerated plan
    today = date.today()
    start_date = today

    # Get first phase for task generation
    first_phase = ai_roadmap.get('phases', [])[0] if ai_roadmap.get('phases') else {
        'name': 'Foundation',
        'goals': ['Establish baseline habits']
    }

    # Generate AI-powered weekly tasks
    ai_tasks = generate_weekly_tasks(
        user_data=user_data,
        phase=first_phase,
        week_number=1,
        start_date=start_date
    )

    # Convert AI tasks to TaskCreate objects
    task_creates = []
    for task in ai_tasks:
        # Map priority string to enum
        priority_map = {
            'low': TaskPriority.LOW,
            'medium': TaskPriority.MEDIUM,
            'high': TaskPriority.HIGH
        }

        # Map time_of_day string to enum
        time_map = {
            'morning': TimeOfDay.MORNING,
            'afternoon': TimeOfDay.AFTERNOON,
            'evening': TimeOfDay.EVENING,
            'anytime': TimeOfDay.ANYTIME
        }

        task_creates.append(TaskCreate(
            title=task.get('title', 'Health Task'),
            description=task.get('description', ''),
            priority=priority_map.get(task.get('priority', 'medium'), TaskPriority.MEDIUM),
            scheduled_date=task.get('scheduled_date', start_date),
            time_of_day=time_map.get(task.get('time_of_day', 'anytime'), TimeOfDay.ANYTIME),
            duration_minutes=task.get('duration_minutes', 30)
        ))

    # Create all tasks
    for task_data in task_creates:
        await crud_task.create_task(db, db_plan.id, task_data)

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
