import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import engine, async_session_factory
from app.models.base import Base
from app.redis_client import close_redis

logger = logging.getLogger("app.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        async with async_session_factory() as session:
            result = await session.execute(text("SELECT COUNT(*) FROM case_masters"))
            count = result.scalar()
            if count == 0:
                from app.seeders.data_seeder import DataSeeder
                seeder = DataSeeder(session)
                await seeder.seed_all()
    except Exception as e:
        logger.warning(f"Database initialization failed: {e}. Running in degraded/mock mode.")

    yield

    try:
        await close_redis()
    except Exception:
        pass
    try:
        await engine.dispose()
    except Exception:
        pass


app = FastAPI(
    title="Crime Intelligence & Analytics Platform",
    description="AI-powered Strategic Intelligence Hub for Karnataka State Police",
    version="1.0.0",
    docs_url="/docs",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import dashboard, cases, map, network, predictions, anomalies, reports, alerts
from app.auth.router import router as auth_router

API_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(dashboard.router, prefix=API_PREFIX)
app.include_router(cases.router, prefix=API_PREFIX)
app.include_router(map.router, prefix=API_PREFIX)
app.include_router(network.router, prefix=API_PREFIX)
app.include_router(predictions.router, prefix=API_PREFIX)
app.include_router(anomalies.router, prefix=API_PREFIX)
app.include_router(reports.router, prefix=API_PREFIX)
app.include_router(alerts.router, prefix=API_PREFIX)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
