from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.db.session import engine
from app.db.base import Base
from app.api.v1.router import router as api_router
from create_admin import create_admin
app = FastAPI(
    title="Project Management API",
    version="1.0.0"
)
@app.on_event("startup")
def startup_event():
    print(" Creating tables...")
    Base.metadata.create_all(bind=engine)
    print(" Creating admin...")
    create_admin()
app.include_router(api_router, prefix="/api/v1")
@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")
@app.get("/health")
def health_check():
    return {"status": "ok"}
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)