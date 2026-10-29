from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.db_bootstrap import run_migrations
from app.routers.alerts import router as alerts_router
from app.routers.auth import router as auth_router
from app.routers.disasters import router as disasters_router
from app.routers.emergency_contacts import router as emergency_contacts_router
from app.routers.emergency_kit import router as emergency_kit_router
from app.routers.family_plan import router as family_plan_router
from app.routers.location import router as location_router
from app.routers.quizzes import router as quizzes_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    run_migrations()
    yield


app = FastAPI(
    title="Disaster Preparedness & Alert System API",
    description="Backend API for disaster preparedness, alerts, learning and risk assessment.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(emergency_kit_router)
app.include_router(family_plan_router)
app.include_router(emergency_contacts_router)
app.include_router(quizzes_router)
app.include_router(disasters_router)
app.include_router(location_router)
app.include_router(alerts_router)


@app.get("/")
def root():
    return {
        "message": "Disaster Preparedness & Alert System API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy"
    }
