"""
AI Engine Package

Provides intelligent health coaching features:
- Plan generation with safety rules
- Task adaptation based on energy levels
- Failure recovery for returning users
"""

from .plan_generator import generate_roadmap, generate_weekly_tasks
from .task_adapter import adapt_tasks, get_task_recommendations
from .failure_recovery import (
    handle_user_return,
    calculate_plan_adjustment,
    generate_comeback_tasks
)

__all__ = [
    'generate_roadmap',
    'generate_weekly_tasks',
    'adapt_tasks',
    'get_task_recommendations',
    'handle_user_return',
    'calculate_plan_adjustment',
    'generate_comeback_tasks',
]
