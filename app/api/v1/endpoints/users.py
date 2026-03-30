from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth_dependency import get_current_user

from app.schemas.user_schema import UserAdminCreate, UserOut
from app.services.user_service import create_user_service

router = APIRouter(tags=["Users"])


# 🔥 ADMIN ONLY → create user
@router.post("/", response_model=UserOut, status_code=201)
def create_user(
    data: UserAdminCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new user (Admin only)
    """
    return create_user_service(
        db=db,
        name=data.name,
        email=data.email,
        password=data.password,
        role=data.role,
        current_user=current_user
    )