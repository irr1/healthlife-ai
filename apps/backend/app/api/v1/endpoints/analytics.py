from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime, timedelta, date
import random

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.analytics import (
    EnergyDataPoint,
    BodyBatteryChart,
    HabitDay,
    HabitGrid,
    HabitsAnalytics,
    Correlation,
    CorrelationsAnalytics
)

router = APIRouter()


@router.get("/body-battery", response_model=BodyBatteryChart)
async def get_body_battery(
    days: int = Query(7, ge=1, le=90, description="Number of days to analyze"),
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> BodyBatteryChart:
    """
    Get body battery / energy chart (stub)

    Analyzes energy levels over time to identify patterns and optimal times.
    This is a stub endpoint - in production, this would analyze actual user data.

    Query parameters:
    - **days**: Number of days to include (1-90, default: 7)

    Returns energy chart with trends and insights
    """
    # Generate stub energy data
    data_points = []
    today = date.today()

    for day_offset in range(days):
        current_date = today - timedelta(days=day_offset)

        # Generate 3-4 data points per day at different times
        times = ["08:00", "12:00", "16:00", "20:00"]
        for time_str in times[:random.randint(3, 4)]:
            # Energy typically higher in morning/afternoon, lower in evening
            hour = int(time_str.split(":")[0])
            base_energy = 7.0 if 8 <= hour <= 14 else 5.0 if 15 <= hour <= 18 else 4.0

            energy = max(0, min(10, base_energy + random.uniform(-2, 2)))

            data_points.append(
                EnergyDataPoint(
                    date=current_date,
                    time=time_str,
                    energy_level=round(energy, 1),
                    activity=random.choice(["Work", "Exercise", "Rest", "Social", None])
                )
            )

    # Calculate statistics
    avg_energy = sum(dp.energy_level for dp in data_points) / len(data_points)

    # Find peak and low times
    time_energies = {}
    for dp in data_points:
        if dp.time not in time_energies:
            time_energies[dp.time] = []
        time_energies[dp.time].append(dp.energy_level)

    avg_by_time = {time: sum(energies) / len(energies) for time, energies in time_energies.items()}
    peak_time = max(avg_by_time, key=avg_by_time.get)
    low_time = min(avg_by_time, key=avg_by_time.get)

    # Generate trends
    trends = [
        "Your energy peaks in the late morning",
        "Consider scheduling important tasks around 10-11 AM",
        "Energy dips after lunch - this is normal",
        "Evening energy could improve with better sleep"
    ]

    return BodyBatteryChart(
        data_points=data_points,
        average_energy=round(avg_energy, 1),
        peak_time=peak_time,
        low_time=low_time,
        trends=random.sample(trends, 3)
    )


@router.get("/habits", response_model=HabitsAnalytics)
async def get_habits_analytics(
    days: int = Query(30, ge=7, le=90, description="Number of days to analyze"),
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> HabitsAnalytics:
    """
    Get habits analytics with completion grid (stub)

    Visualizes habit completion over time with streaks and completion rates.
    This is a stub endpoint - in production, this would track actual habit data.

    Query parameters:
    - **days**: Number of days to include (7-90, default: 30)

    Returns habit grids with completion statistics
    """
    # Generate stub habit data
    habit_names = [
        "Morning Exercise",
        "Meditation",
        "Healthy Breakfast",
        "8 Hours Sleep",
        "10K Steps"
    ]

    habits = []
    today = date.today()

    for habit_name in habit_names:
        # Each habit has different completion rate
        base_completion_rate = random.uniform(0.6, 0.9)

        habit_days = []
        current_streak = 0
        completed_count = 0

        for day_offset in range(days - 1, -1, -1):
            current_date = today - timedelta(days=day_offset)
            completed = random.random() < base_completion_rate

            if completed:
                completed_count += 1
                if day_offset == 0 or (day_offset > 0 and habit_days and habit_days[-1].completed):
                    current_streak += 1
                else:
                    current_streak = 1
            else:
                if day_offset == 0:
                    current_streak = 0

            habit_days.append(
                HabitDay(
                    date=current_date,
                    completed=completed,
                    notes=random.choice([None, "Felt great!", "Tough day", "Making progress"]) if completed else None
                )
            )

        completion_rate = (completed_count / days) * 100

        habits.append(
            HabitGrid(
                habit_name=habit_name,
                days=habit_days,
                streak=current_streak,
                completion_rate=round(completion_rate, 1)
            )
        )

    # Calculate overall statistics
    overall_completion = sum(h.completion_rate for h in habits) / len(habits)
    best_habit = max(habits, key=lambda h: h.completion_rate).habit_name
    worst_habit = min(habits, key=lambda h: h.completion_rate).habit_name

    return HabitsAnalytics(
        habits=habits,
        overall_completion=round(overall_completion, 1),
        best_habit=best_habit,
        improvement_area=worst_habit
    )


@router.get("/correlations", response_model=CorrelationsAnalytics)
async def get_correlations(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> CorrelationsAnalytics:
    """
    Get health correlations analytics (Pro feature stub)

    Identifies correlations between different health metrics.
    This is a stub endpoint - in production, this would require Pro subscription
    and analyze actual user data to find correlations.

    Returns correlation analysis with actionable insights
    """
    # Check if user has Pro (stub - in production, check subscription)
    has_pro = False  # Stub

    if not has_pro:
        # Return limited data for non-Pro users
        return CorrelationsAnalytics(
            correlations=[
                Correlation(
                    variable_x="Sleep Quality",
                    variable_y="Energy Level",
                    correlation_coefficient=0.72,
                    strength="strong",
                    direction="positive",
                    insight="Better sleep strongly correlates with higher energy levels"
                )
            ],
            recommendations=[
                "Upgrade to Pro to unlock full correlation analysis",
                "Discover how your habits affect each other",
                "Get personalized optimization recommendations"
            ],
            requires_pro=True
        )

    # Pro user - return full correlations (stub data)
    correlations = [
        Correlation(
            variable_x="Sleep Quality",
            variable_y="Energy Level",
            correlation_coefficient=0.72,
            strength="strong",
            direction="positive",
            insight="7+ hours of sleep increases next-day energy by 40%"
        ),
        Correlation(
            variable_x="Exercise",
            variable_y="Sleep Quality",
            correlation_coefficient=0.58,
            strength="moderate",
            direction="positive",
            insight="Morning exercise improves sleep quality significantly"
        ),
        Correlation(
            variable_x="Screen Time Before Bed",
            variable_y="Sleep Quality",
            correlation_coefficient=-0.65,
            strength="strong",
            direction="negative",
            insight="Screen time within 1 hour of bed reduces sleep quality"
        ),
        Correlation(
            variable_x="Hydration",
            variable_y="Energy Level",
            correlation_coefficient=0.45,
            strength="moderate",
            direction="positive",
            insight="Proper hydration (2L+ water) boosts energy levels"
        ),
        Correlation(
            variable_x="Stress Level",
            variable_y="Sleep Quality",
            correlation_coefficient=-0.55,
            strength="moderate",
            direction="negative",
            insight="High stress days lead to poorer sleep quality"
        )
    ]

    recommendations = [
        "Prioritize sleep - it has the strongest impact on your energy",
        "Morning exercise creates a positive cycle: better sleep → more energy → better workouts",
        "Reduce screen time 1-2 hours before bed to improve sleep quality",
        "Track hydration - it's an easy win for energy levels",
        "Manage stress through meditation or evening routines"
    ]

    return CorrelationsAnalytics(
        correlations=correlations,
        recommendations=recommendations,
        requires_pro=False
    )
