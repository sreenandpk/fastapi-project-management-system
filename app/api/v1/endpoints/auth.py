from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth_schema import (
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest
)
from app.services.auth_service import (
    login_user,
    refresh_access_token,
    logout_user
)
router = APIRouter(tags=["Auth"])
@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, data.email, data.password)
@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    return refresh_access_token(db, data.refresh_token)
@router.post("/logout")
def logout(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    return logout_user(db, data.refresh_token)