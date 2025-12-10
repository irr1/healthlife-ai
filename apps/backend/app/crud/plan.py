from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.plan import Plan
from app.models.task import Task
from app.schemas.plan import PlanCreate, PlanUpdate


async def get_plan_by_id(db: AsyncSession, plan_id: int) -> Optional[Plan]:
    """Get plan by ID"""
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    return result.scalar_one_or_none()


async def get_user_plans(db: AsyncSession, user_id: int) -> List[Plan]:
    """Get all plans for a user"""
    result = await db.execute(
        select(Plan)
        .where(Plan.user_id == user_id)
        .order_by(Plan.created_at.desc())
    )
    return result.scalars().all()


async def get_active_plan(db: AsyncSession, user_id: int) -> Optional[Plan]:
    """Get user's active plan"""
    result = await db.execute(
        select(Plan)
        .where(Plan.user_id == user_id, Plan.is_active == True)
        .order_by(Plan.created_at.desc())
    )
    return result.scalar_one_or_none()


async def create_plan(db: AsyncSession, user_id: int, plan_in: PlanCreate) -> Plan:
    """
    Create new plan for user

    Args:
        db: Database session
        user_id: User ID
        plan_in: Plan creation schema

    Returns:
        Created plan
    """
    db_plan = Plan(
        user_id=user_id,
        title=plan_in.title,
        description=plan_in.description,
        roadmap=plan_in.roadmap,
        current_phase=0,
        completion_percentage=0.0,
        is_active=True,
    )

    db.add(db_plan)
    await db.flush()
    await db.refresh(db_plan)

    return db_plan


async def update_plan(db: AsyncSession, plan_id: int, plan_in: PlanUpdate) -> Optional[Plan]:
    """
    Update plan

    Args:
        db: Database session
        plan_id: Plan ID to update
        plan_in: Plan update schema

    Returns:
        Updated plan or None if not found
    """
    db_plan = await get_plan_by_id(db, plan_id)
    if not db_plan:
        return None

    update_data = plan_in.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_plan, field, value)

    await db.flush()
    await db.refresh(db_plan)

    return db_plan


async def get_plan_tasks(db: AsyncSession, plan_id: int) -> List[Task]:
    """Get all tasks for a plan"""
    result = await db.execute(
        select(Task).where(Task.plan_id == plan_id).order_by(Task.scheduled_date)
    )
    return result.scalars().all()


async def deactivate_user_plans(db: AsyncSession, user_id: int) -> None:
    """Deactivate all plans for a user"""
    result = await db.execute(
        select(Plan).where(Plan.user_id == user_id, Plan.is_active == True)
    )
    plans = result.scalars().all()

    for plan in plans:
        plan.is_active = False

    await db.flush()
