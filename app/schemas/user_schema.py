from pydantic import BaseModel, EmailStr, Field
from app.models.user_model import UserRole
class UserBase(BaseModel):
    name: str
    email: EmailStr
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)
#ADMIN ONLY → create user with role
class UserAdminCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)
    role: UserRole  
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole  
    class Config:
        from_attributes = True