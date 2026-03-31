from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.dependencies.auth_dependency import get_current_user
from app.schemas.task_schema import (
    TaskCreate,
    TaskOut,
    TaskUpdateStatus,
    TaskAssign
)
from app.models.task_model import TaskStatus
from app.services.task_service import (
    create_task_service,
    get_tasks_service,
    get_task_service,
    update_task_status_service,
    assign_task_service
)
router = APIRouter(tags=["Tasks"])
#CREATE TASK (ADMIN ONLY)
@router.post("/", response_model=TaskOut)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_task_service(db, data, current_user)
#GET TASKS (FULL FILTER SYSTEM)
@router.get("/", response_model=list[TaskOut])
def get_tasks(
    status: Optional[TaskStatus] = None,
    project_id: Optional[int] = None,
    assigned_to: Optional[int] = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_tasks_service(
        db,
        current_user,
        status,
        project_id,
        assigned_to,
        skip,
        limit
    )
#GET SINGLE TASK
@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_task_service(db, task_id, current_user)
#UPDATE TASK STATUS (DEVELOPER ONLY)
@router.patch("/{task_id}/status", response_model=TaskOut)
def update_task_status(
    task_id: int,
    data: TaskUpdateStatus,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return update_task_status_service(
        db,
        task_id,
        data.status,
        current_user
    )
#ASSIGN TASK (ADMIN ONLY)
@router.patch("/{task_id}/assign", response_model=TaskOut)
def assign_task(
    task_id: int,
    data: TaskAssign,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return assign_task_service(
        db,
        task_id,
        data.user_id,
        current_user
    )