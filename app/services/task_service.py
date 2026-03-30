from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone, timedelta
from sqlalchemy import func
from app.models.task_model import Task, TaskStatus
from app.models.project_model import Project
from app.models.user_model import User, UserRole
from app.crud.task_crud import (
    create_task,
    get_task_by_id,
    update_task_status
)
IST = timezone(timedelta(hours=5, minutes=30))
def get_task_or_404(db: Session, task_id: int):
    task = get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task
def check_task_access(task: Task, current_user):
    if current_user.role == UserRole.ADMIN:
        return
    if task.assigned_to != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
#CREATE TASK (ADMIN ONLY)
def create_task_service(db: Session, data, current_user):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can create tasks"
        )
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(404, "Project not found")
    if data.assigned_to:
        user = db.query(User).filter(User.id == data.assigned_to).first()
        if not user:
            raise HTTPException(404, "Assigned user not found")
        if user.role != UserRole.DEVELOPER:
            raise HTTPException(400, "Task can only be assigned to developers")
    #Prevent duplicate task title 
    existing_task = db.query(Task).filter(
        Task.project_id == data.project_id,
        func.lower(Task.title) == data.title.lower()
    ).first()
    if existing_task:
        raise HTTPException(
            status_code=400,
            detail="Task with this title already exists in this project"
        )
    # 🇮🇳 Ensure IST + prevent past date
    if data.due_date:
        if data.due_date.tzinfo is None:
            data.due_date = data.due_date.replace(tzinfo=IST)
        if data.due_date < datetime.now(IST):
            raise HTTPException(
                status_code=400,
                detail="Task due date cannot be in the past"
            )
    task = Task(
        title=data.title,
        description=data.description,
        project_id=data.project_id,
        assigned_to=data.assigned_to,
        due_date=data.due_date,
        created_by=current_user.id
    )
    return create_task(db, task)
#GET TASKS (FULL FILTER SYSTEM)
def get_tasks_service(
    db: Session,
    current_user,
    status: TaskStatus = None,
    project_id: int = None,
    assigned_to: int = None,
    skip: int = 0,
    limit: int = 10
):
    query = db.query(Task)
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Task.assigned_to == current_user.id)
    if status:
        query = query.filter(Task.status == status)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)
    return query.offset(skip).limit(limit).all()
#GET SINGLE TASK
def get_task_service(db: Session, task_id: int, current_user):
    task = get_task_or_404(db, task_id)
    check_task_access(task, current_user)
    return task
#UPDATE TASK STATUS (DEVELOPER ONLY)
def update_task_status_service(db: Session, task_id: int, status_value, current_user):
    task = get_task_or_404(db, task_id)
    if task.assigned_to != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your tasks"
        )
    return update_task_status(db, task, status_value)
#ADMIN REASSIGN TASK
def assign_task_service(db: Session, task_id: int, user_id: int, current_user):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can assign tasks"
        )
    task = get_task_or_404(db, task_id)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    if user.role != UserRole.DEVELOPER:
        raise HTTPException(400, "Can assign only to developers")
    task.assigned_to = user_id
    db.commit()
    db.refresh(task)
    return task