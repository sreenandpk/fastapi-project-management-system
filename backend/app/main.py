from fastapi import FastAPI
from app.db.session import engine
from app.db.base import Base
from app.api.v1.router import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from create_admin import create_admin  
app = FastAPI(title="Project Management API")
@app.on_event("startup")
def startup_event():
    print(" Creating tables...")
    Base.metadata.create_all(bind=engine)

    print(" Creating admin...")
    create_admin()
app.include_router(api_router, prefix="/api/v1")
@app.get("/")
def test_db():
    try:
        connection = engine.connect()
        return {"message": "DB Connected "}
    except Exception as e:
        return {"error": str(e)}
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)