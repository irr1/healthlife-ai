"""
Analytics API Endpoints

Endpoints for:
- Body Battery tracking and prediction
- Energy history and trends
- Habit grid (task completion visualization)
- Streak tracking
"""

from datetime import date, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.daily_metric import (
    DailyMetric,
    DailyMetricCreate,
    DailyMetricUpdate,
    BodyBatteryResponse,
    EnergyHistoryResponse
)
from app.crud import daily_metric as crud_metric
from app.services.body_battery import (
    get_current_body_battery,
    predict_tomorrow_energy,
    get_energy_trend,
    get_energy_advice
)

router = APIRouter()


@router.post("/metrics", response_model=DailyMetric, status_code=status.HTTP_201_CREATED)
async def log_daily_metric(
    metric_data: DailyMetricCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> DailyMetric:
    """
    Log daily metrics (energy, sleep, mood, stress, weight)

    Creates new metric or updates existing one for the date.
    Used when user manually logs their daily data.
    """
    db_metric = await crud_metric.create_or_update_metric(
        db, current_user.id, metric_data
    )
    await db.commit()
    await db.refresh(db_metric)
    return db_metric


@router.get("/metrics/today", response_model=DailyMetric)
async def get_today_metric(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> DailyMetric:
    """Get today's metrics"""
    metric = await crud_metric.get_metric_today(db, current_user.id)

    if not metric:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No metrics logged for today"
        )

    return metric


@router.get("/metrics/{metric_date}", response_model=DailyMetric)
async def get_metric_by_date(
    metric_date: date,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> DailyMetric:
    """Get metrics for specific date"""
    metric = await crud_metric.get_metric_by_date(db, current_user.id, metric_date)

    if not metric:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No metrics found for {metric_date}"
        )

    return metric


@router.patch("/metrics/{metric_date}", response_model=DailyMetric)
async def update_daily_metric(
    metric_date: date,
    update_data: DailyMetricUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> DailyMetric:
    """Update metrics for specific date"""
    metric = await crud_metric.get_metric_by_date(db, current_user.id, metric_date)

    if not metric:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No metrics found for {metric_date}"
        )

    updated_metric = await crud_metric.update_metric(db, metric, update_data)
    await db.commit()
    await db.refresh(updated_metric)
    return updated_metric


@router.get("/body-battery", response_model=BodyBatteryResponse)
async def get_body_battery(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> BodyBatteryResponse:
    """
    Get current Body Battery status

    Returns:
    - Current energy level (0-100)
    - Trend (increasing/stable/decreasing)
    - Prediction for tomorrow
    - Personalized advice
    """
    current_energy, _ = await get_current_body_battery(db, current_user.id)
    trend = await get_energy_trend(db, current_user.id, days=7)
    prediction = await predict_tomorrow_energy(db, current_user.id)
    advice = await get_energy_advice(db, current_user.id)

    return BodyBatteryResponse(
        current_energy=current_energy,
        trend=trend,
        prediction_tomorrow=prediction,
        advice=advice
    )


@router.get("/energy-history", response_model=List[EnergyHistoryResponse])
async def get_energy_history(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> List[EnergyHistoryResponse]:
    """
    Get energy history for last N days (default 7)

    Returns daily energy levels, tasks completed, and sleep hours
    for visualization in charts.
    """
    if days < 1 or days > 90:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Days must be between 1 and 90"
        )

    metrics = await crud_metric.get_metrics_last_n_days(db, current_user.id, days)

    # Fill in missing dates with None values
    end_date = date.today()
    start_date = end_date - timedelta(days=days - 1)

    result = []
    metric_dict = {m.date: m for m in metrics}

    current_date = start_date
    while current_date <= end_date:
        metric = metric_dict.get(current_date)
        result.append(EnergyHistoryResponse(
            date=current_date,
            energy_level=metric.energy_level if metric else None,
            tasks_completed=metric.tasks_completed if metric else 0,
            hours_slept=metric.hours_slept if metric else None
        ))
        current_date += timedelta(days=1)

    return result


@router.get("/habits", response_model=List[dict])
async def get_habit_grid(
    days: int = 90,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> List[dict]:
    """
    Get habit grid data (GitHub-style contribution graph)

    Returns task completion data for last N days for visualization.
    Each day shows: date, tasks_completed, completion_level (0-4)

    Completion levels:
    - 0: No tasks (empty)
    - 1: 1 task (light)
    - 2: 2-3 tasks (medium)
    - 3: 4-5 tasks (high)
    - 4: 6+ tasks (intense)
    """
    if days < 1 or days > 365:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Days must be between 1 and 365"
        )

    metrics = await crud_metric.get_metrics_last_n_days(db, current_user.id, days)

    # Create grid data
    grid_data = []
    for metric in metrics:
        # Determine completion level
        tasks = metric.tasks_completed
        if tasks == 0:
            level = 0
        elif tasks == 1:
            level = 1
        elif tasks <= 3:
            level = 2
        elif tasks <= 5:
            level = 3
        else:
            level = 4

        grid_data.append({
            "date": metric.date.isoformat(),
            "tasks_completed": tasks,
            "completion_level": level
        })

    return grid_data


@router.get("/streak", response_model=dict)
async def get_current_streak(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> dict:
    """
    Get current streak (consecutive days with at least 1 task completed)

    Returns:
    - current_streak: Number of consecutive days
    - message: Motivational message based on streak
    """
    streak = await crud_metric.get_streak(db, current_user.id)

    # Generate motivational message
    if streak == 0:
        message = "Start your streak today! Complete your first task."
    elif streak == 1:
        message = "Great start! Keep the momentum going."
    elif streak < 7:
        message = f"{streak} days strong! You're building a habit."
    elif streak < 30:
        message = f"Amazing! {streak} day streak. You're on fire! 🔥"
    elif streak < 100:
        message = f"Incredible! {streak} days in a row. You're unstoppable!"
    else:
        message = f"Legendary! {streak} day streak. You're a true champion! 🏆"

    return {
        "current_streak": streak,
        "message": message
    }


@router.get("/correlations/sleep-energy", response_model=dict)
async def get_sleep_energy_correlation(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> dict:
    """
    Analyze correlation between sleep and energy (Pro feature)

    Returns correlation coefficient and insights.
    """
    # Get last 30 days of data
    metrics = await crud_metric.get_metrics_last_n_days(db, current_user.id, 30)

    # Filter metrics with both sleep and energy data
    data_points = [
        (m.hours_slept, m.energy_level)
        for m in metrics
        if m.hours_slept is not None and m.energy_level is not None
    ]

    if len(data_points) < 5:
        return {
            "correlation": None,
            "insight": "Not enough data. Log sleep and energy for at least 5 days.",
            "data_points": len(data_points)
        }

    # Simple correlation calculation
    sleep_values = [x[0] for x in data_points]
    energy_values = [x[1] for x in data_points]

    n = len(data_points)
    mean_sleep = sum(sleep_values) / n
    mean_energy = sum(energy_values) / n

    numerator = sum((s - mean_sleep) * (e - mean_energy) for s, e in data_points)
    denom_sleep = sum((s - mean_sleep) ** 2 for s in sleep_values) ** 0.5
    denom_energy = sum((e - mean_energy) ** 2 for e in energy_values) ** 0.5

    if denom_sleep == 0 or denom_energy == 0:
        correlation = 0
    else:
        correlation = numerator / (denom_sleep * denom_energy)

    # Generate insight
    if correlation > 0.5:
        insight = "Strong positive correlation! More sleep = more energy for you."
    elif correlation > 0.2:
        insight = "Moderate positive correlation. Sleep helps your energy."
    elif correlation < -0.2:
        insight = "Interesting! Your energy might be affected by sleep quality, not just duration."
    else:
        insight = "Weak correlation. Other factors might be influencing your energy more."

    return {
        "correlation": round(correlation, 2),
        "insight": insight,
        "data_points": n,
        "average_sleep": round(mean_sleep, 1),
        "average_energy": round(mean_energy, 1)
    }
