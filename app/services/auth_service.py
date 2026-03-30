from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
from app.crud.user_crud import get_user_by_email
from app.core.security.hashing import verify_password
from app.core.security.jwt import create_access_token
from app.models.refresh_token_model import RefreshToken
from app.core.exceptions import InvalidCredentialsException, InvalidTokenException
def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        raise InvalidCredentialsException()
    if not verify_password(password, user.password_hash):
        raise InvalidCredentialsException()
    access_token = create_access_token({
        "sub": str(user.id),
        "role": user.role.value
    })
    refresh_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=7)
    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=expires_at
    )
    db.add(db_token)
    db.commit()
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
def refresh_access_token(db: Session, refresh_token: str):
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token
    ).first()
    if not db_token:
        raise InvalidTokenException()
    if db_token.expires_at < datetime.utcnow():
        raise InvalidTokenException()
    user = db_token.user
    new_access_token = create_access_token({
        "sub": str(user.id),
        "role": user.role.value
    })
    return {
        "access_token": new_access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
def logout_user(db: Session, refresh_token: str):
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token
    ).first()
    if db_token:
        db.delete(db_token)
        db.commit()
    return {"message": "Logged out successfully"}