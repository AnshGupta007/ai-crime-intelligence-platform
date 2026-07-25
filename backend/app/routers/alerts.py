from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("")
async def list_alerts(
    limit: int = Query(20, ge=1, le=100),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.dashboard_service import get_recent_alerts
    return await get_recent_alerts(db, limit)


@router.post("/{alert_id}/read")
async def mark_alert_read(
    alert_id: int,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.dashboard_service import mark_alert_read
    return await mark_alert_read(db, alert_id)
