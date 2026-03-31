from sqlalchemy.orm import Session
from app.models.user_model import User, UserRole
from app.core.security.hashing import hash_password
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email.lower()).first()
def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()
def create_user(db: Session, name: str, email: str, password: str, role: UserRole):
    email = email.lower()
    if role not in [UserRole.ADMIN, UserRole.DEVELOPER]:
        raise ValueError("Invalid role")
    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role  
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()