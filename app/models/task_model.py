from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Enum,
    Index
)
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta, timezone
import enum
from app.db.base import Base
# 🇮🇳 IST timezone
IST = timezone(timedelta(hours=5, minutes=30))
def get_ist_time():
    return datetime.now(IST)
#Task Status Enum
class TaskStatus(enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"
class Task(Base):
    __tablename__ = "tasks"
    #Primary Key
    id = Column(Integer, primary_key=True, index=True)
    #Core Fields
    title = Column(String(100), nullable=False)
    description = Column(String, nullable=True)
    #Status
    status = Column(
        Enum(TaskStatus),
        default=TaskStatus.TODO,
        nullable=False,
        index=True
    )
    #Relationships
    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    assigned_to = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    created_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    #Timeline
    due_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=get_ist_time,
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=get_ist_time,
        onupdate=get_ist_time,
        nullable=False
    )
    #ORM Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship(
        "User",
        foreign_keys=[assigned_to],
        back_populates="tasks"
    )
    creator = relationship(
        "User",
        foreign_keys=[created_by],
        back_populates="created_tasks"
    )
    #Performance Indexes
    __table_args__ = (
        Index("idx_project_status", "project_id", "status"),
        Index("idx_assigned_status", "assigned_to", "status"),
    )
    #Debugging
    def __repr__(self):
        return f"<Task id={self.id} title={self.title} status={self.status.value}>"