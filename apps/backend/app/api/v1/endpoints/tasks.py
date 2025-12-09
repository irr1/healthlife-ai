from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.task import Task, TaskUpdate, TaskLog
from app.crud import plan as crud_plan
from app.crud import task as crud_task

router = APIRouter()


@router.get("/today", response_model=List[Task])
async def get_today_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> List[Task]:
    """
    Get tasks scheduled for today

    Returns list of tasks for the current active plan scheduled for today
    """
    # Get active plan
    plan = await crud_plan.get_active_plan(db, current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active plan found. Generate a new plan first."
        )

    # Get today's tasks
    today = datetime.utcnow().date()
    tasks = await crud_task.get_tasks_by_date(db, plan.id, today)

    return tasks


@router.patch("/{task_id}", response_model=Task)
async def update_task_status(
    task_id: int,
    task_in: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> Task:
    """
    Update task status and other properties

    - **title**: Optional new title
    - **description**: Optional new description
    - **status**: Optional new status (pending/in_progress/completed/cancelled/skipped)
    - **priority**: Optional new priority (low/medium/high)
    - **scheduled_date**: Optional new scheduled date
    - **time_of_day**: Optional new time of day (morning/afternoon/evening/anytime)
    - **duration_minutes**: Optional new duration in minutes
    - **notes**: Optional notes

    Returns updated task
    """
    # Get active plan
    plan = await crud_plan.get_active_plan(db, current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active plan found"
        )

    # Get task
    task = await crud_task.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify task belongs to user's active plan
    if task.plan_id != plan.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update task from another plan"
        )

    # Update task
    updated_task = await crud_task.update_task(db, task_id, task_in)
    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    await db.commit()
    await db.refresh(updated_task)

    return updated_task


@router.post("/{task_id}/log", response_model=Task)
async def log_task(
    task_id: int,
    log_data: TaskLog,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> Task:
    """
    Log task completion with notes

    Marks task as completed and adds completion notes

    - **notes**: Optional notes about task completion

    Returns completed task
    """
    # Get active plan
    plan = await crud_plan.get_active_plan(db, current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active plan found"
        )

    # Get task
    task = await crud_task.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify task belongs to user's active plan
    if task.plan_id != plan.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot log task from another plan"
        )

    # Log completion
    completed_task = await crud_task.log_task_completion(db, task_id, log_data.notes)
    if not completed_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    await db.commit()
    await db.refresh(completed_task)

    return completed_task


@router.get("/history", response_model=List[Task])
async def get_task_history(
    limit: int = Query(50, ge=1, le=100, description="Number of tasks to return"),
    offset: int = Query(0, ge=0, description="Number of tasks to skip"),
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> List[Task]:
    """
    Get task history (completed, cancelled, skipped tasks)

    Query parameters:
    - **limit**: Number of tasks to return (1-100, default: 50)
    - **offset**: Number of tasks to skip (default: 0)

    Returns list of completed/cancelled/skipped tasks ordered by completion date
    """
    # Get active plan
    plan = await crud_plan.get_active_plan(db, current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active plan found. Generate a new plan first."
        )

    # Get task history
    tasks = await crud_task.get_task_history(db, plan.id, limit, offset)

    return tasks
