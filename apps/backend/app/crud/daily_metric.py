"""
Daily Metric CRUD Operations

Create, Read, Update operations for daily metrics
"""

from datetime import date, timedelta
from typing import List, Optional
from sqlalchemy import select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.daily_metric import DailyMetric
from app.schemas.daily_metric import DailyMetricCreate, DailyMetricUpdate


async def create_or_update_metric(
    db: AsyncSession,
    user_id: int,
    metric_data: DailyMetricCreate
) -> DailyMetric:
    """
    Create or update daily metric for a specific date

    If metric already exists for the date, update it.
    Otherwise, create new metric.
    """
    # Check if metric exists for this date
    stmt = select(DailyMetric).where(
        and_(
            DailyMetric.user_id == user_id,
            DailyMetric.date == metric_data.date
        )
    )
    result = await db.execute(stmt)
    existing_metric = result.scalar_one_or_none()

    if existing_metric:
        # Update existing metric
        for field, value in metric_data.model_dump(exclude_unset=True).items():
            if field != 'date':  # Don't update date
                setattr(existing_metric, field, value)
        await db.flush()
        await db.refresh(existing_metric)
        return existing_metric
    else:
        # Create new metric
        db_metric = DailyMetric(
            user_id=user_id,
            **metric_data.model_dump()
        )
        db.add(db_metric)
        await db.flush()
        await db.refresh(db_metric)
        return db_metric


async def get_metric_by_date(
    db: AsyncSession,
    user_id: int,
    metric_date: date
) -> Optional[DailyMetric]:
    """Get daily metric for specific date"""
    stmt = select(DailyMetric).where(
        and_(
            DailyMetric.user_id == user_id,
            DailyMetric.date == metric_date
        )
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_metric_today(
    db: AsyncSession,
    user_id: int
) -> Optional[DailyMetric]:
    """Get today's metric"""
    today = date.today()
    return await get_metric_by_date(db, user_id, today)


async def get_metrics_range(
    db: AsyncSession,
    user_id: int,
    start_date: date,
    end_date: date
) -> List[DailyMetric]:
    """Get daily metrics for date range"""
    stmt = select(DailyMetric).where(
        and_(
            DailyMetric.user_id == user_id,
            DailyMetric.date >= start_date,
            DailyMetric.date <= end_date
        )
    ).order_by(DailyMetric.date.asc())

    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_metrics_last_n_days(
    db: AsyncSession,
    user_id: int,
    days: int = 7
) -> List[DailyMetric]:
    """Get metrics for last N days"""
    end_date = date.today()
    start_date = end_date - timedelta(days=days - 1)
    return await get_metrics_range(db, user_id, start_date, end_date)


async def update_metric(
    db: AsyncSession,
    metric: DailyMetric,
    update_data: DailyMetricUpdate
) -> DailyMetric:
    """Update existing metric"""
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(metric, field, value)

    await db.flush()
    await db.refresh(metric)
    return metric


async def increment_tasks_completed(
    db: AsyncSession,
    user_id: int,
    task_date: date,
    exercise_minutes: int = 0
) -> DailyMetric:
    """
    Increment tasks_completed counter for a date
    Also add exercise minutes if task was exercise-related
    """
    metric = await get_metric_by_date(db, user_id, task_date)

    if not metric:
        # Create metric if doesn't exist
        metric = DailyMetric(
            user_id=user_id,
            date=task_date,
            tasks_completed=1,
            exercise_minutes=exercise_minutes
        )
        db.add(metric)
    else:
        # Update existing
        metric.tasks_completed += 1
        metric.exercise_minutes += exercise_minutes

    await db.flush()
    await db.refresh(metric)
    return metric


async def get_average_energy(
    db: AsyncSession,
    user_id: int,
    days: int = 7
) -> Optional[float]:
    """Calculate average energy level over last N days"""
    end_date = date.today()
    start_date = end_date - timedelta(days=days - 1)

    stmt = select(func.avg(DailyMetric.energy_level)).where(
        and_(
            DailyMetric.user_id == user_id,
            DailyMetric.date >= start_date,
            DailyMetric.date <= end_date,
            DailyMetric.energy_level.isnot(None)
        )
    )

    result = await db.execute(stmt)
    avg = result.scalar()
    return float(avg) if avg else None


async def get_streak(
    db: AsyncSession,
    user_id: int
) -> int:
    """
    Calculate current streak of days with at least 1 task completed
    Counts backwards from today until finding a day with 0 tasks
    """
    today = date.today()
    streak = 0
    current_date = today

    # Check up to 365 days back
    for _ in range(365):
        metric = await get_metric_by_date(db, user_id, current_date)

        if not metric or metric.tasks_completed == 0:
            break

        streak += 1
        current_date -= timedelta(days=1)

    return streak
