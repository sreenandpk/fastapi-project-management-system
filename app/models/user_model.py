from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base
#Role Enum 
class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    DEVELOPER = "DEVELOPER"
class User(Base):
    __tablename__ = "users"
    #Primary Key
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(
        Enum(UserRole),
        default=UserRole.DEVELOPER,
        nullable=False,
        index=True
    )
    password_hash = Column(String, nullable=False)
    #Timestamps
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
    #Admin → owns projects
    projects = relationship(
        "Project",
        back_populates="owner"
    )
    #Tasks assigned to developer
    tasks = relationship(
        "Task",
        foreign_keys="Task.assigned_to",
        back_populates="assignee"
    )
    #Tasks created by admin
    created_tasks = relationship(
        "Task",
        foreign_keys="Task.created_by",
        back_populates="creator"
    )
    #Debugging
    def __repr__(self):
        return f"<User id={self.id} email={self.email} role={self.role.value}>"