from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.security.jwt import decode_token
from app.db.session import get_db
from app.crud.user_crud import get_user_by_id
from app.models.user_model import UserRole 
security = HTTPBearer()
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_id(db, int(user_id))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
#Single role
def require_role(role: UserRole):
    def role_checker(current_user=Depends(get_current_user)):
        if current_user.role != role:
            raise HTTPException(
                status_code=403,
                detail="Not authorized"
            )
        return current_user
    return role_checker
#Multiple roles 
def require_roles(roles: list[UserRole]):
    def role_checker(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=403,
                detail="Not authorized"
            )
        return current_user
    return role_checker