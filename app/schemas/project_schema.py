from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None
class ProjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    owner_id: int
    created_by_name: Optional[str] = None
    created_by_role: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True