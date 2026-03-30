from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base
from app.api.v1.router import router as api_router
from app.models.user_model import User
from app.models.project_model import Project
from app.models.task_model import Task
app = FastAPI(title="Project Management API")
Base.metadata.create_all(bind=engine)
app.include_router(api_router, prefix="/api/v1")
@app.get("/")
def test_db():
    try:
        connection = engine.connect()
        return {"message": "DB Connected "}
    except Exception as e: 
        return {"error": str(e)}