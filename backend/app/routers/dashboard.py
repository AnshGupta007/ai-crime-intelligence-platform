from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user, get_user_scope
from app.database import get_db
from app.schemas.dashboard import SummaryKPIs, TrendData, CategoryBreakdown, AlertOut
from app.utils.cache import cache_get, cache_set

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=SummaryKPIs)
async def get_summary(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    scope = get_user_scope(user)
    district_id = scope["district_id"]
    cache_key = f"dashboard:summary:{district_id or 'all'}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    from app.services.dashboard_service import get_summary_kpis
    result = await get_summary_kpis(db, district_id=district_id)
    await cache_set(cache_key, result, 300)
    return result


@router.get("/trends", response_model=TrendData)
async def get_trends(
    months: int = Query(6, ge=1, le=24),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    scope = get_user_scope(user)
    district_id = scope["district_id"]
    cache_key = f"dashboard:trends:{months}:{district_id or 'all'}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    from app.services.dashboard_service import get_trends
    result = await get_trends(db, months)
    await cache_set(cache_key, result, 300)
    return result


@router.get("/categories", response_model=list[CategoryBreakdown])
async def get_categories(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cached = await cache_get("dashboard:categories")
    if cached:
        return cached
    from app.services.dashboard_service import get_crime_categories
    result = await get_crime_categories(db)
    await cache_set("dashboard:categories", result, 300)
    return result


@router.get("/alerts", response_model=list[AlertOut])
async def get_alerts(
    limit: int = Query(10, ge=1, le=100),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cache_key = f"dashboard:alerts:{limit}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    from app.services.dashboard_service import get_recent_alerts
    result = await get_recent_alerts(db, limit)
    await cache_set(cache_key, result, 120)
    return result


@router.get("/recent-cases")
async def get_recent_cases(
    limit: int = Query(10, ge=1, le=100),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cache_key = f"dashboard:recent-cases:{limit}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    from app.services.dashboard_service import get_recent_cases
    result = await get_recent_cases(db, limit)
    await cache_set(cache_key, result, 120)
    return result
