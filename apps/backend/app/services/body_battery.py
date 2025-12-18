"""
Body Battery Algorithm

Calculates user's energy level based on:
- Sleep (hours and quality)
- Physical activity (exercise minutes)
- Stress level
- Task completion rate

Body Battery Scale:
- 0-20: Exhausted (rest needed)
- 21-40: Low energy (light activities only)
- 41-60: Moderate (normal activities)
- 61-80: Good (ready for challenges)
- 81-100: Excellent (peak performance)
"""

from datetime import date, timedelta
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import daily_metric as crud_metric
from app.models.daily_metric import DailyMetric


def calculate_body_battery(
    previous_energy: int,
    hours_slept: Optional[float] = None,
    sleep_quality: Optional[int] = None,
    exercise_minutes: int = 0,
    stress_level: Optional[int] = None,
    tasks_completed: int = 0,
    tasks_total: int = 0
) -> int:
    """
    Calculate Body Battery for the day

    Args:
        previous_energy: Energy level from previous day (0-100)
        hours_slept: Hours of sleep (0-24)
        sleep_quality: Sleep quality 1-10
        exercise_minutes: Minutes of exercise
        stress_level: Stress level 1-10
        tasks_completed: Number of tasks completed
        tasks_total: Total number of tasks scheduled

    Returns:
        Energy level 0-100
    """
    energy = previous_energy

    # Sleep recovery (max +50)
    if hours_slept is not None:
        # Optimal sleep is 7-9 hours
        if 7 <= hours_slept <= 9:
            sleep_boost = 50
        elif hours_slept < 7:
            # Too little sleep - reduced boost
            sleep_boost = int(hours_slept * 6)  # ~42 for 7h
        else:
            # Too much sleep - slightly reduced
            sleep_boost = 45

        # Adjust by sleep quality
        if sleep_quality is not None:
            quality_multiplier = sleep_quality / 10
            sleep_boost = int(sleep_boost * quality_multiplier)

        energy += sleep_boost

    # Exercise effect (moderate boost for light-moderate, slight drain for intense)
    if exercise_minutes > 0:
        if exercise_minutes <= 30:
            # Light exercise: small boost
            energy += 5
        elif exercise_minutes <= 60:
            # Moderate exercise: neutral or small boost
            energy += 0
        else:
            # Intense/long exercise: temporary drain (but good long-term)
            energy -= 10

    # Stress impact (max -30)
    if stress_level is not None:
        if stress_level >= 8:
            energy -= 30  # High stress
        elif stress_level >= 6:
            energy -= 15  # Moderate stress
        elif stress_level >= 4:
            energy -= 5  # Mild stress
        # Low stress (1-3): no penalty

    # Task completion boost (sense of accomplishment)
    if tasks_total > 0:
        completion_rate = tasks_completed / tasks_total
        if completion_rate >= 0.8:
            energy += 10  # Great day!
        elif completion_rate >= 0.5:
            energy += 5  # Good progress
        elif completion_rate < 0.3:
            energy -= 5  # Might feel unproductive

    # Clamp between 0-100
    energy = max(0, min(100, energy))

    return energy


async def get_current_body_battery(
    db: AsyncSession,
    user_id: int
) -> Tuple[int, str]:
    """
    Get current body battery and status

    Returns:
        (energy_level, status_message)
    """
    today_metric = await crud_metric.get_metric_today(db, user_id)

    if today_metric and today_metric.energy_level is not None:
        energy = today_metric.energy_level
    else:
        # Calculate based on yesterday + today's data
        yesterday = date.today() - timedelta(days=1)
        yesterday_metric = await crud_metric.get_metric_by_date(db, user_id, yesterday)

        previous_energy = yesterday_metric.energy_level if yesterday_metric and yesterday_metric.energy_level else 50

        # Calculate with available data
        energy = calculate_body_battery(
            previous_energy=previous_energy,
            hours_slept=today_metric.hours_slept if today_metric else None,
            sleep_quality=today_metric.sleep_quality if today_metric else None,
            exercise_minutes=today_metric.exercise_minutes if today_metric else 0,
            stress_level=today_metric.stress_level if today_metric else None,
            tasks_completed=today_metric.tasks_completed if today_metric else 0,
            tasks_total=0  # TODO: get from tasks table
        )

    # Determine status
    if energy >= 81:
        status = "Excellent - Peak performance!"
    elif energy >= 61:
        status = "Good - Ready for challenges"
    elif energy >= 41:
        status = "Moderate - Normal activities"
    elif energy >= 21:
        status = "Low - Light activities recommended"
    else:
        status = "Exhausted - Rest needed"

    return energy, status


async def predict_tomorrow_energy(
    db: AsyncSession,
    user_id: int,
    planned_sleep: float = 8.0
) -> int:
    """
    Predict tomorrow's energy based on current level + planned sleep

    Assumes:
    - User will sleep planned_sleep hours
    - Average sleep quality
    - No extreme stress
    """
    current_energy, _ = await get_current_body_battery(db, user_id)

    # Simple prediction: current + sleep recovery
    predicted = calculate_body_battery(
        previous_energy=current_energy,
        hours_slept=planned_sleep,
        sleep_quality=7,  # Assume average quality
        exercise_minutes=0,
        stress_level=5,  # Assume moderate stress
        tasks_completed=0,
        tasks_total=0
    )

    return predicted


async def get_energy_trend(
    db: AsyncSession,
    user_id: int,
    days: int = 7
) -> str:
    """
    Analyze energy trend over last N days

    Returns: "increasing", "stable", or "decreasing"
    """
    metrics = await crud_metric.get_metrics_last_n_days(db, user_id, days)

    if len(metrics) < 3:
        return "stable"  # Not enough data

    # Get energy levels
    energy_levels = [m.energy_level for m in metrics if m.energy_level is not None]

    if len(energy_levels) < 3:
        return "stable"

    # Simple trend: compare first half vs second half
    mid = len(energy_levels) // 2
    first_half_avg = sum(energy_levels[:mid]) / mid
    second_half_avg = sum(energy_levels[mid:]) / (len(energy_levels) - mid)

    diff = second_half_avg - first_half_avg

    if diff > 5:
        return "increasing"
    elif diff < -5:
        return "decreasing"
    else:
        return "stable"


async def get_energy_advice(
    db: AsyncSession,
    user_id: int
) -> str:
    """
    Generate personalized advice based on current energy and trends
    """
    energy, _ = await get_current_body_battery(db, user_id)
    trend = await get_energy_trend(db, user_id, days=7)
    today_metric = await crud_metric.get_metric_today(db, user_id)

    advice_parts = []

    # Energy-based advice
    if energy < 40:
        advice_parts.append("Your energy is low. Prioritize rest and recovery today.")
    elif energy > 80:
        advice_parts.append("Great energy! Perfect time for challenging workouts.")

    # Trend-based advice
    if trend == "decreasing":
        advice_parts.append("Your energy has been declining. Focus on sleep quality and stress management.")
    elif trend == "increasing":
        advice_parts.append("Energy trending up! Keep up your current habits.")

    # Sleep-based advice
    if today_metric and today_metric.hours_slept:
        if today_metric.hours_slept < 7:
            advice_parts.append("Try to get 7-9 hours of sleep tonight.")
        elif today_metric.hours_slept > 9:
            advice_parts.append("You might be oversleeping. Aim for 7-9 hours.")

    # Stress-based advice
    if today_metric and today_metric.stress_level and today_metric.stress_level >= 7:
        advice_parts.append("High stress detected. Consider meditation or light stretching.")

    if not advice_parts:
        advice_parts.append("Keep maintaining your healthy habits!")

    return " ".join(advice_parts)
