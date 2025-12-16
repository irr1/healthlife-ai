"""
Failure Recovery Module

Handles user absence and helps them get back on track.
Removes overdue tasks, adjusts plan, and provides welcoming message.
"""

from typing import Dict, Any, List, Tuple
from datetime import date, timedelta


def handle_user_return(
    user_data: Dict[str, Any],
    days_absent: int,
    overdue_tasks: List[Dict[str, Any]],
    current_plan: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Handle user returning after period of absence

    Args:
        user_data: User profile
        days_absent: Number of days since last activity
        overdue_tasks: List of tasks that are now overdue
        current_plan: Current health plan

    Returns:
        Dict with recovery strategy:
        {
            "welcome_message": str,
            "tasks_to_remove": List[int],  # IDs of tasks to delete
            "plan_adjustment": Dict,  # Suggested plan changes
            "restart_strategy": str,  # How to restart
            "motivation": str
        }
    """
    recovery = {
        "welcome_message": "",
        "tasks_to_remove": [],
        "plan_adjustment": {},
        "restart_strategy": "",
        "motivation": ""
    }

    # Short absence (1-3 days)
    if days_absent <= 3:
        recovery["welcome_message"] = f"Welcome back! You've been away for {days_absent} day(s). Let's pick up where you left off!"
        recovery["restart_strategy"] = "continue"
        recovery["motivation"] = "Short breaks are normal. What matters is getting back on track."

        # Remove only severely overdue tasks (older than 2 days)
        for task in overdue_tasks:
            task_date = task.get('scheduled_date')
            if isinstance(task_date, date):
                days_old = (date.today() - task_date).days
                if days_old > 2:
                    recovery["tasks_to_remove"].append(task.get('id'))

    # Medium absence (4-7 days)
    elif days_absent <= 7:
        recovery["welcome_message"] = f"Good to see you again! It's been {days_absent} days. Let's ease back into your routine."
        recovery["restart_strategy"] = "ease_back"
        recovery["motivation"] = "Taking a week off happens. The important thing is you're back now. Start light and rebuild momentum."

        # Remove all overdue tasks
        recovery["tasks_to_remove"] = [task.get('id') for task in overdue_tasks if task.get('id')]

        # Suggest easier tasks for the first few days
        recovery["plan_adjustment"] = {
            "reduce_intensity": True,
            "extend_phase": 3,  # Add 3 days to current phase
            "focus": "Re-establish habit, not intensity"
        }

    # Long absence (8-14 days)
    elif days_absent <= 14:
        recovery["welcome_message"] = f"Welcome back! It's been {days_absent} days. No judgment - life happens. Let's create a gentle restart plan."
        recovery["restart_strategy"] = "soft_restart"
        recovery["motivation"] = "Two weeks away means we need to rebuild gradually. Think of this as Phase 1 again, but you'll progress faster with your experience."

        # Clear all overdue tasks
        recovery["tasks_to_remove"] = [task.get('id') for task in overdue_tasks if task.get('id')]

        # Suggest plan reset
        recovery["plan_adjustment"] = {
            "restart_phase": True,
            "current_phase": "Foundation",
            "reduce_intensity": True,
            "message": "Restart current phase with reduced intensity"
        }

    # Very long absence (15+ days)
    else:
        recovery["welcome_message"] = f"Welcome back after {days_absent} days! Ready for a fresh start? Let's rebuild your journey together."
        recovery["restart_strategy"] = "full_restart"
        recovery["motivation"] = "A long break means it's time for a fresh beginning. You've learned what works and what doesn't. Use that knowledge for an even better journey this time."

        # Clear everything and suggest full plan regeneration
        recovery["tasks_to_remove"] = [task.get('id') for task in overdue_tasks if task.get('id')]

        recovery["plan_adjustment"] = {
            "regenerate_plan": True,
            "reason": "Extended absence - fresh start recommended",
            "keep_history": True,  # Keep past data for learning
            "message": "Consider generating a new plan based on updated goals"
        }

    return recovery


def calculate_plan_adjustment(
    current_phase: int,
    total_phases: int,
    completion_percentage: float,
    days_absent: int
) -> Tuple[int, float]:
    """
    Calculate how to adjust the plan after absence

    Args:
        current_phase: Current phase number (0-indexed)
        total_phases: Total number of phases
        completion_percentage: Current completion (0-100)
        days_absent: Days since last activity

    Returns:
        Tuple of (new_phase, new_completion_percentage)
    """
    # Short absence: no change
    if days_absent <= 3:
        return current_phase, completion_percentage

    # Medium absence: reduce completion slightly
    elif days_absent <= 7:
        # Reduce completion by 10-15%
        new_completion = max(0, completion_percentage - 10)
        return current_phase, new_completion

    # Long absence: go back one phase or reset
    elif days_absent <= 14:
        # Go back to previous phase if not in first phase
        new_phase = max(0, current_phase - 1)
        # Reset to 50% of current completion
        new_completion = max(0, completion_percentage * 0.5)
        return new_phase, new_completion

    # Very long absence: restart from beginning
    else:
        return 0, 0.0


def generate_comeback_tasks(
    user_data: Dict[str, Any],
    days_absent: int,
    previous_performance: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Generate appropriate "comeback" tasks for user's first days back

    Args:
        user_data: User profile
        days_absent: Number of days absent
        previous_performance: Data about previous task completion

    Returns:
        List of gentle restart tasks
    """
    today = date.today()

    # Base comeback tasks (light and encouraging)
    if days_absent <= 3:
        # Short absence: normal tasks
        return [
            {
                "title": "Welcome Back Walk",
                "description": "15-minute easy walk to restart your routine",
                "priority": "medium",
                "scheduled_date": today,
                "time_of_day": "morning",
                "duration_minutes": 15
            },
            {
                "title": "Quick Check-In",
                "description": "Reflect on your goals and recommit to your journey",
                "priority": "medium",
                "scheduled_date": today,
                "time_of_day": "anytime",
                "duration_minutes": 10
            }
        ]

    elif days_absent <= 7:
        # Medium absence: very light restart
        return [
            {
                "title": "Gentle Movement",
                "description": "10-minute light stretching or easy walk - just get moving again",
                "priority": "high",
                "scheduled_date": today,
                "time_of_day": "morning",
                "duration_minutes": 10
            },
            {
                "title": "Set Today's Intention",
                "description": "Write down one small health goal for today",
                "priority": "medium",
                "scheduled_date": today,
                "time_of_day": "morning",
                "duration_minutes": 5
            },
            {
                "title": "Hydration Reset",
                "description": "Drink 4 glasses of water throughout the day",
                "priority": "high",
                "scheduled_date": today,
                "time_of_day": "anytime",
                "duration_minutes": 5
            }
        ]

    else:
        # Long absence: ultra-light restart over 3 days
        return [
            # Day 1: Absolute minimum
            {
                "title": "5-Minute Movement",
                "description": "Just 5 minutes of any movement - walk, stretch, dance. Anything counts!",
                "priority": "high",
                "scheduled_date": today,
                "time_of_day": "anytime",
                "duration_minutes": 5
            },
            {
                "title": "Fresh Start Reflection",
                "description": "Why are you restarting? Write it down. This is your motivation.",
                "priority": "high",
                "scheduled_date": today,
                "time_of_day": "anytime",
                "duration_minutes": 10
            },
            # Day 2: Slightly more
            {
                "title": "10-Minute Morning Walk",
                "description": "Build on yesterday - 10 minutes of walking",
                "priority": "medium",
                "scheduled_date": today + timedelta(days=1),
                "time_of_day": "morning",
                "duration_minutes": 10
            },
            # Day 3: Building momentum
            {
                "title": "15-Minute Activity",
                "description": "You're building momentum! 15 minutes of your choice",
                "priority": "medium",
                "scheduled_date": today + timedelta(days=2),
                "time_of_day": "morning",
                "duration_minutes": 15
            }
        ]
