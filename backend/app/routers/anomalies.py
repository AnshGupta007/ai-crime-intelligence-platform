from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db

router = APIRouter(prefix="/anomalies", tags=["anomalies"])


@router.get("")
async def list_anomalies(
    limit: int = Query(20, ge=1, le=100),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.anomaly_service import get_recent_anomalies
    return await get_recent_anomalies(db, limit)


@router.get("/{anomaly_id}")
async def get_anomaly(
    anomaly_id: int,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.anomaly_service import get_anomaly_detail
    return await get_anomaly_detail(db, anomaly_id)


@router.post("/{anomaly_id}/review")
async def review_anomaly(
    anomaly_id: int,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.anomaly_service import mark_as_reviewed
    return await mark_as_reviewed(db, anomaly_id)
