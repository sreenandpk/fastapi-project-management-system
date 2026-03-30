from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.task_model import TaskStatus
#Create Task (Admin)
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    project_id: int
    assigned_to: Optional[int] = None
    due_date: Optional[datetime] = None
#Update Task Status (Developer)
class TaskUpdateStatus(BaseModel):
    status: TaskStatus
#Assign Task (Admin)
class TaskAssign(BaseModel):
    user_id: int
#Response Schema
class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: TaskStatus
    project_id: int
    assigned_to: Optional[int]
    created_by: int
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
        use_enum_values = True