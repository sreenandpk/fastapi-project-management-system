from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.crud.user_crud import create_user, get_user_by_email, get_users
from app.models.user_model import UserRole
def create_user_service(
    db: Session,
    name: str,
    email: str,
    password: str,
    role: UserRole,
    current_user
):
    #Only ADMIN can create users
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can create users"
        )
    #Prevent admin from creating another admin
    if role == UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin cannot create another admin"
        )
    #Check if user already exists
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    if role not in [UserRole.ADMIN, UserRole.DEVELOPER]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role"
        )
    user = create_user(
        db=db,
        name=name,
        email=email,
        password=password,
        role=role
    )
    return user

def get_users_service(db: Session, current_user, skip: int = 0, limit: int = 100):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can view users directory"
        )
    return get_users(db, skip=skip, limit=limit)