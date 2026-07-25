from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user, validate_scope
from app.database import get_db
from app.schemas.prediction import ForecastOut, RiskScoreOut
from app.utils.cache import cache_get, cache_set

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.get("/forecast", response_model=ForecastOut)
async def get_forecast(
    district_id: int | None = None,
    category_id: int | None = None,
    days: int = Query(30, ge=1, le=365),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    validate_scope(user, requested_district_id=district_id)
    cache_key = f"predictions:forecast:{district_id or 'all'}:{category_id or 'all'}:{days}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    from app.services.prediction_service import get_crime_forecast
    result = await get_crime_forecast(db, district_id, category_id, days)
    await cache_set(cache_key, result, 3600)
    return result


@router.get("/risk-scores", response_model=list[RiskScoreOut])
async def get_risk_scores(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cached = await cache_get("predictions:risk-scores")
    if cached:
        return cached
    from app.services.prediction_service import get_risk_scores
    result = await get_risk_scores(db)
    await cache_set("predictions:risk-scores", result, 3600)
    return result


@router.get("/socio-economic")
async def get_socio_economic(
    district_id: int | None = None,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    validate_scope(user, requested_district_id=district_id)
    cache_key = f"predictions:socio-economic:{district_id or 'all'}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    from app.services.prediction_service import get_socio_economic
    result = await get_socio_economic(db, district_id)
    await cache_set(cache_key, result, 3600)
    return result
