from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth_dependency import get_current_user
from app.schemas.dashboard_schema import DashboardStats
from app.services.dashboard_service import get_dashboard_stats
router = APIRouter(tags=["Dashboard"])
@router.get("/", response_model=DashboardStats)
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_dashboard_stats(db, current_user)