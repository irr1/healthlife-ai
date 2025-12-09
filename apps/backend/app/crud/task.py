from datetime import date, datetime
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


async def get_task_by_id(db: AsyncSession, task_id: int) -> Optional[Task]:
    """Get task by ID"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    return result.scalar_one_or_none()


async def get_plan_tasks(db: AsyncSession, plan_id: int) -> List[Task]:
    """Get all tasks for a plan"""
    result = await db.execute(
        select(Task)
        .where(Task.plan_id == plan_id)
        .order_by(Task.scheduled_date, Task.created_at)
    )
    return result.scalars().all()


async def get_tasks_by_date(db: AsyncSession, plan_id: int, target_date: date) -> List[Task]:
    """Get tasks scheduled for a specific date"""
    result = await db.execute(
        select(Task)
        .where(
            Task.plan_id == plan_id,
            Task.scheduled_date == target_date
        )
        .order_by(Task.time_of_day, Task.created_at)
    )
    return result.scalars().all()


async def get_task_history(
    db: AsyncSession,
    plan_id: int,
    limit: int = 50,
    offset: int = 0
) -> List[Task]:
    """Get task history (completed, cancelled, skipped tasks)"""
    result = await db.execute(
        select(Task)
        .where(
            Task.plan_id == plan_id,
            Task.status.in_([TaskStatus.COMPLETED, TaskStatus.CANCELLED, TaskStatus.SKIPPED])
        )
        .order_by(Task.completed_at.desc(), Task.updated_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


async def create_task(db: AsyncSession, plan_id: int, task_in: TaskCreate) -> Task:
    """
    Create new task

    Args:
        db: Database session
        plan_id: Plan ID
        task_in: Task creation schema

    Returns:
        Created task
    """
    db_task = Task(
        plan_id=plan_id,
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority,
        scheduled_date=task_in.scheduled_date,
        time_of_day=task_in.time_of_day,
        duration_minutes=task_in.duration_minutes,
        status=TaskStatus.PENDING,
    )

    db.add(db_task)
    await db.flush()
    await db.refresh(db_task)

    return db_task


async def update_task(db: AsyncSession, task_id: int, task_in: TaskUpdate) -> Optional[Task]:
    """
    Update task

    Args:
        db: Database session
        task_id: Task ID to update
        task_in: Task update schema

    Returns:
        Updated task or None if not found
    """
    db_task = await get_task_by_id(db, task_id)
    if not db_task:
        return None

    update_data = task_in.model_dump(exclude_unset=True)

    # If status is being changed to completed, set completed_at
    if "status" in update_data and update_data["status"] == TaskStatus.COMPLETED:
        update_data["completed_at"] = datetime.utcnow().date()

    for field, value in update_data.items():
        setattr(db_task, field, value)

    await db.flush()
    await db.refresh(db_task)

    return db_task


async def log_task_completion(
    db: AsyncSession,
    task_id: int,
    notes: Optional[str] = None
) -> Optional[Task]:
    """
    Log task completion with notes

    Args:
        db: Database session
        task_id: Task ID
        notes: Completion notes

    Returns:
        Updated task or None if not found
    """
    db_task = await get_task_by_id(db, task_id)
    if not db_task:
        return None

    db_task.status = TaskStatus.COMPLETED
    db_task.completed_at = datetime.utcnow().date()
    if notes:
        db_task.notes = notes

    await db.flush()
    await db.refresh(db_task)

    return db_task
