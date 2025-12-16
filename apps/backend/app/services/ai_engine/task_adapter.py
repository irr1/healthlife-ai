"""
Task Adapter Module

Adapts tasks based on user's current energy level and context.
Simplifies tasks when energy is low, increases difficulty when energy is high.
"""

from typing import Dict, Any, List
from datetime import datetime


def adapt_tasks(
    tasks: List[Dict[str, Any]],
    user_data: Dict[str, Any],
    energy_level: int
) -> List[Dict[str, Any]]:
    """
    Adapt tasks based on user's energy level

    Args:
        tasks: List of tasks to adapt
        user_data: User profile data
        energy_level: Current energy level (1-10)
            1-3: Low energy - simplify tasks
            4-7: Normal energy - keep as is
            8-10: High energy - can increase intensity

    Returns:
        Adapted list of tasks
    """
    if not tasks:
        return []

    adapted_tasks = []

    for task in tasks:
        adapted_task = task.copy()

        # Low energy (1-3): Simplify
        if energy_level <= 3:
            adapted_task = _simplify_task(adapted_task)
            adapted_task['adapted_reason'] = f"Simplified for low energy ({energy_level}/10)"

        # High energy (8-10): Can increase intensity
        elif energy_level >= 8:
            adapted_task = _intensify_task(adapted_task)
            adapted_task['adapted_reason'] = f"Increased for high energy ({energy_level}/10)"

        # Normal energy (4-7): Keep as is
        else:
            adapted_task['adapted_reason'] = "Optimal task for current energy"

        adapted_tasks.append(adapted_task)

    return adapted_tasks


def _simplify_task(task: Dict[str, Any]) -> Dict[str, Any]:
    """Simplify a task for low energy"""
    task = task.copy()

    # Reduce duration by 30-50%
    original_duration = task.get('duration_minutes', 30)
    task['duration_minutes'] = max(5, int(original_duration * 0.5))

    # Lower priority if it's high
    if task.get('priority') == 'high':
        task['priority'] = 'medium'

    # Simplify description with easier alternative
    title = task.get('title', '').lower()

    if 'workout' in title or 'cardio' in title or 'training' in title:
        task['description'] = f"{task.get('description', '')} → Light version: Gentle walk or stretching instead"

    elif 'meal' in title or 'cook' in title or 'prep' in title:
        task['description'] = f"{task.get('description', '')} → Simplified: Quick healthy option or pre-prepared meal"

    elif 'yoga' in title or 'stretching' in title:
        task['description'] = f"{task.get('description', '')} → Gentle version: Focus on breathing and light movement"

    return task


def _intensify_task(task: Dict[str, Any]) -> Dict[str, Any]:
    """Increase task intensity for high energy"""
    task = task.copy()

    # Increase duration by 20-30%
    original_duration = task.get('duration_minutes', 30)
    task['duration_minutes'] = min(90, int(original_duration * 1.25))

    # Can upgrade priority
    if task.get('priority') == 'medium':
        task['priority'] = 'high'

    # Add intensity suggestions
    title = task.get('title', '').lower()

    if 'walk' in title:
        task['description'] = f"{task.get('description', '')} → Enhanced: Add intervals or incline for extra challenge"

    elif 'workout' in title or 'training' in title:
        task['description'] = f"{task.get('description', '')} → Intensity boost: Add extra set or increase weight/reps"

    elif 'yoga' in title:
        task['description'] = f"{task.get('description', '')} → Advanced: Include more challenging poses or hold longer"

    return task


def get_task_recommendations(
    user_data: Dict[str, Any],
    completed_tasks: List[Dict[str, Any]],
    energy_history: List[int]
) -> Dict[str, Any]:
    """
    Generate recommendations based on task completion patterns and energy levels

    Args:
        user_data: User profile
        completed_tasks: Recently completed tasks
        energy_history: Recent energy levels (last 7 days)

    Returns:
        Dict with recommendations:
        {
            "optimal_time": str,
            "suggested_difficulty": str,
            "rest_recommendation": bool,
            "patterns": List[str]
        }
    """
    recommendations = {
        "optimal_time": "morning",  # Default
        "suggested_difficulty": "medium",
        "rest_recommendation": False,
        "patterns": []
    }

    # Analyze energy patterns
    if energy_history:
        avg_energy = sum(energy_history) / len(energy_history)

        if avg_energy < 5:
            recommendations["rest_recommendation"] = True
            recommendations["suggested_difficulty"] = "low"
            recommendations["patterns"].append(
                "Your energy has been consistently low. Consider taking a rest day or lighter activities."
            )
        elif avg_energy > 7:
            recommendations["suggested_difficulty"] = "high"
            recommendations["patterns"].append(
                "Your energy levels are great! This is a good time to push yourself."
            )

        # Check for declining energy
        if len(energy_history) >= 3:
            recent_avg = sum(energy_history[-3:]) / 3
            older_avg = sum(energy_history[:-3]) / max(1, len(energy_history) - 3)

            if recent_avg < older_avg - 2:
                recommendations["rest_recommendation"] = True
                recommendations["patterns"].append(
                    "Your energy is declining. Prioritize recovery and rest."
                )

    # Analyze completion patterns
    if completed_tasks:
        morning_tasks = sum(1 for t in completed_tasks if t.get('time_of_day') == 'morning')
        total = len(completed_tasks)

        if morning_tasks / total > 0.6:
            recommendations["optimal_time"] = "morning"
            recommendations["patterns"].append(
                "You tend to complete more tasks in the morning. Schedule important activities early."
            )

    return recommendations
