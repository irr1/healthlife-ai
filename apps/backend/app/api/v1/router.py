from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    plans,
    tasks,
    journey,
    coach,
    analytics,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(plans.router, prefix="/plans", tags=["plans"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(journey.router, prefix="/journey", tags=["journey"])
api_router.include_router(coach.router, prefix="/coach", tags=["coach"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
