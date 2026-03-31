from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, projects, tasks,dashboard
router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["Auth"])
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(projects.router, prefix="/projects", tags=["Projects"])
router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
router.include_router(dashboard.router, prefix="/dashboard",tags=["Dashboard"])