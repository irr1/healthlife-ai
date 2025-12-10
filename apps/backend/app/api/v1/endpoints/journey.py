from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User as UserModel
from app.models.task import Task, TaskStatus
from app.schemas.journey import Milestone, WeeklyReviewCreate, WeeklyReview, Progress
from app.crud import plan as crud_plan
from app.crud import task as crud_task
from sqlalchemy import select, func

router = APIRouter()


@router.get("/roadmap", response_model=Dict[str, Any])
async def get_roadmap(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Get user's journey roadmap

    Returns the complete journey roadmap with phases, current progress,
    and upcoming milestones from the active plan.

    Returns:
    - **phases**: List of plan phases
    - **current_phase**: Current phase index
    - **completion**: Overall completion percentage
    - **timeline**: Timeline information
    """
    # Get active plan
    plan = await crud_plan.get_active_plan(db, current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active plan found. Generate a new plan first."
        )

    # Extract roadmap from plan
    roadmap = plan.roadmap or {}
    phases = roadmap.get("phases", [])
    timeline = roadmap.get("timeline", {})

    return {
        "phases": phases,
        "current_phase": plan.current_phase,
        "completion": plan.completion_percentage,
        "timeline": timeline,
        "plan_title": plan.title,
        "plan_description": plan.description
    }


@router.get("/milestones", response_model=List[Dict[str, Any]])
async def get_milestones(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """
    Get journey milestones

    Returns list of milestones from the current plan's roadmap.
    In production, this would be stored in a separate milestones table.

    Returns list of milestone objects with:
    - **name**: Milestone name
    - **phase**: Phase index
    - **status**: Completion status (pending/achieved)
    """
    # Get active plan
    plan = await crud_plan.get_active_plan(db, current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active plan found. Generate a new plan first."
        )

    # Extract milestones from roadmap
    roadmap = plan.roadmap or {}
    phases = roadmap.get("phases", [])

    milestones = []
    for phase_idx, phase in enumerate(phases):
        phase_milestones = phase.get("milestones", [])
        for milestone in phase_milestones:
            milestones.append({
                "name": milestone,
                "phase": phase_idx,
                "phase_name": phase.get("name", f"Phase {phase_idx + 1}"),
                "status": "achieved" if phase_idx < plan.current_phase else "pending"
            })

    return milestones


@router.post("/weekly-review", response_model=Dict[str, Any])
async def complete_weekly_review(
    review_data: WeeklyReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Complete weekly review

    Submit a weekly review with wins, challenges, and lessons learned.
    This is a stub endpoint - in production, this would save to a weekly_reviews table.

    - **week_number**: Week number (1-53)
    - **wins**: List of achievements
    - **challenges**: List of challenges faced
    - **lessons**: List of lessons learned
    - **energy_average**: Average energy level (0-10)
    - **notes**: Optional notes

    Returns confirmation with review summary
    """
    # In production, save to database
    # For now, return a stub response

    return {
        "message": "Weekly review completed successfully",
        "week_number": review_data.week_number,
        "summary": {
            "wins_count": len(review_data.wins),
            "challenges_count": len(review_data.challenges),
            "lessons_count": len(review_data.lessons),
            "energy_average": review_data.energy_average
        },
        "next_steps": [
            "Review your wins and celebrate progress",
            "Address challenges in next week's plan",
            "Apply lessons learned to improve"
        ],
        "created_at": datetime.utcnow().isoformat()
    }


@router.get("/progress", response_model=Progress)
async def get_progress(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
) -> Progress:
    """
    Get journey progress

    Returns comprehensive progress metrics including:
    - Overall completion percentage
    - Current phase information
    - Tasks completion stats
    - Current streak
    - Milestones progress

    Returns progress object with all metrics
    """
    # Get active plan
    plan = await crud_plan.get_active_plan(db, current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active plan found. Generate a new plan first."
        )

    # Get all tasks for the plan
    all_tasks = await crud_plan.get_plan_tasks(db, plan.id)

    # Count completed tasks
    completed_tasks = sum(1 for task in all_tasks if task.status == TaskStatus.COMPLETED)
    total_tasks = len(all_tasks)

    # Calculate streak (simplified - in production, use actual completion dates)
    # For now, return a stub value
    streak_days = 0
    if completed_tasks > 0:
        # Stub: assume 1 day per completed task
        streak_days = min(completed_tasks, 7)

    # Count milestones
    roadmap = plan.roadmap or {}
    phases = roadmap.get("phases", [])
    total_milestones = sum(len(phase.get("milestones", [])) for phase in phases)

    # Milestones reached = milestones in completed phases
    milestones_reached = 0
    for phase_idx in range(plan.current_phase):
        if phase_idx < len(phases):
            milestones_reached += len(phases[phase_idx].get("milestones", []))

    return Progress(
        overall_completion=plan.completion_percentage,
        current_phase=plan.current_phase,
        total_phases=len(phases),
        tasks_completed=completed_tasks,
        tasks_total=total_tasks,
        streak_days=streak_days,
        milestones_reached=milestones_reached,
        milestones_total=total_milestones
    )
