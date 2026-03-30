from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth_dependency import get_current_user

from app.schemas.project_schema import ProjectCreate, ProjectOut

from app.services.project_service import (
    create_project_service,
    get_projects_service,
    get_project_service,
    delete_project_service
)

router = APIRouter(tags=["Projects"])


# 🔥 ADMIN ONLY → create project
@router.post("/", response_model=ProjectOut)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return create_project_service(
        db,
        data.name,
        data.description,
        current_user
    )


# 🔓 ALL USERS → get projects (RBAC applied)
@router.get("/", response_model=list[ProjectOut])
def get_projects(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_projects_service(db, current_user, skip, limit)


# 🔓 ALL USERS → get single project
@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_project_service(db, project_id, current_user)


# 🔥 ADMIN ONLY → delete project
@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return delete_project_service(db, project_id, current_user)