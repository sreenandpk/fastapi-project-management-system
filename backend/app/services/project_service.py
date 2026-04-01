from sqlalchemy.orm import Session
from sqlalchemy import exists
from fastapi import HTTPException, status
from app.crud.project_crud import (
    create_project,
    get_project_by_id,
    get_all_projects,
    get_developer_projects,
    delete_project
)
from app.models.task_model import Task
from app.models.user_model import UserRole  
def get_project_or_404(db: Session, project_id: int):
    project = get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project
def check_project_access(db: Session, project_id: int, user_id: int):
    return db.query(
        exists().where(
            Task.project_id == project_id,
            Task.assigned_to == user_id
        )
    ).scalar()
#CREATE PROJECT → ADMIN ONLY
def create_project_service(db: Session, name: str, description: str, current_user):
    if current_user.role != UserRole.ADMIN:  
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can create projects"
        )
    return create_project(
        db=db,
        name=name,
        description=description,
        owner_id=current_user.id,
        created_by_name=current_user.name,
        created_by_role=current_user.role.value  
    )
#GET PROJECTS
def get_projects_service(db: Session, current_user, skip: int = 0, limit: int = 10):
    if current_user.role == UserRole.ADMIN:   # ✅ FIX
        return get_all_projects(db, skip, limit)
    return get_developer_projects(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )
#GET SINGLE PROJECT
def get_project_service(db: Session, project_id: int, current_user):
    project = get_project_or_404(db, project_id)
    if current_user.role == UserRole.ADMIN: 
        return project
    if not check_project_access(db, project_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this project"
        )
    return project
#DELETE PROJECT → ADMIN ONLY
def delete_project_service(db: Session, project_id: int, current_user):
    project = get_project_or_404(db, project_id)
    if current_user.role != UserRole.ADMIN:   
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can delete projects"
        )
    delete_project(db, project)
    return {"message": "Project deleted successfully"}