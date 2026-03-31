from sqlalchemy.orm import Session
from app.models.project_model import Project
from app.models.task_model import Task
#CREATE PROJECT 
def create_project(
    db: Session,
    name: str,
    description: str,
    owner_id: int,
    created_by_name: str,
    created_by_role: str
):
    project = Project(
        name=name,
        description=description,
        owner_id=owner_id,
        created_by_name=created_by_name,
        created_by_role=created_by_role
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
#GET PROJECT BY ID
def get_project_by_id(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()
#GET ALL PROJECTS (ADMIN)
def get_all_projects(db: Session, skip: int = 0, limit: int = 10):
    return (
        db.query(Project)
        .offset(skip)
        .limit(limit)
        .all()
    )
#GET PROJECTS FOR DEVELOPER (BASED ON TASKS)
def get_developer_projects(db: Session, user_id: int, skip: int = 0, limit: int = 10):
    return (
        db.query(Project)
        .join(Task, Task.project_id == Project.id)
        .filter(Task.assigned_to == user_id)
        .distinct()
        .offset(skip)
        .limit(limit)
        .all()
    )
#DELETE PROJECT
def delete_project(db: Session, project: Project):
    db.delete(project)
    db.commit()