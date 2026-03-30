from sqlalchemy.orm import Session
from app.models.task_model import Task, TaskStatus
#CREATE TASK
def create_task(db: Session, task: Task):
    db.add(task)
    db.commit()
    db.refresh(task)
    return task
#GET TASK BY ID
def get_task_by_id(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()
#GET ALL TASKS (ADMIN)
def get_all_tasks(db: Session, skip: int = 0, limit: int = 10):
    return (
        db.query(Task)
        .offset(skip)
        .limit(limit)
        .all()
    )
#GET TASKS BY USER 
def get_tasks_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 10):
    return (
        db.query(Task)
        .filter(Task.assigned_to == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
#GET TASKS BY STATUS
def get_tasks_by_status(db: Session, status: TaskStatus, skip: int = 0, limit: int = 10):
    return (
        db.query(Task)
        .filter(Task.status == status)
        .offset(skip)
        .limit(limit)
        .all()
    )


#UPDATE TASK STATUS
def update_task_status(db: Session, task: Task, status_value):
    task.status = TaskStatus(status_value)
    db.commit()
    db.refresh(task)
    return task
#ASSIGN TASK (ADMIN)
def assign_task(db: Session, task: Task, user_id: int):
    task.assigned_to = user_id
    db.commit()
    db.refresh(task)
    return task
#DELETE TASK (OPTIONAL)
def delete_task(db: Session, task: Task):
    db.delete(task)
    db.commit()