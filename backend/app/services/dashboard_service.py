from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.task_model import Task, TaskStatus
from app.models.project_model import Project
from app.models.user_model import UserRole
def get_dashboard_stats(db: Session, current_user):
    task_query = db.query(Task)
    if current_user.role != UserRole.ADMIN:
        task_query = task_query.filter(Task.assigned_to == current_user.id)
    total_tasks = task_query.count()
    todo = task_query.filter(Task.status == TaskStatus.TODO).count()
    in_progress = task_query.filter(Task.status == TaskStatus.IN_PROGRESS).count()
    done = task_query.filter(Task.status == TaskStatus.DONE).count()
    my_tasks = db.query(Task).filter(Task.assigned_to == current_user.id).count()
    if current_user.role == UserRole.ADMIN:
        projects = db.query(Project).count()
    else:
        projects = (
            db.query(Project)
            .join(Task, Task.project_id == Project.id)
            .filter(Task.assigned_to == current_user.id)
            .distinct()
            .count()
        )
    return {
        "total_tasks": total_tasks,
        "todo": todo,
        "in_progress": in_progress,
        "done": done,
        "my_tasks": my_tasks,
        "projects": projects
    }