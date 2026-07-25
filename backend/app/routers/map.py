from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user, validate_scope
from app.database import get_db
from app.schemas.map import DistrictDensity, HotspotOut, CaseMapPin, TemporalPattern
from app.utils.cache import cache_get, cache_set

router = APIRouter(prefix="/map", tags=["map"])


@router.get("/districts", response_model=list[DistrictDensity])
async def get_districts(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cached = await cache_get("map:districts")
    if cached:
        return cached
    from app.services.map_service import get_district_crime_density
    result = await get_district_crime_density(db)
    await cache_set("map:districts", result, 300)
    return result


@router.get("/districts/{district_id}/density", response_model=DistrictDensity)
async def get_district_density(
    district_id: int,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    validate_scope(user, requested_district_id=district_id)
    cache_key = f"map:district-density:{district_id}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    from app.services.map_service import get_district_density_detail
    result = await get_district_density_detail(db, district_id)
    if result:
        await cache_set(cache_key, result, 300)
    return result


@router.get("/hotspots", response_model=list[HotspotOut])
async def get_hotspots(
    district_id: int | None = None,
    category_id: int | None = None,
    days: int = Query(30, ge=1, le=365),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    validate_scope(user, requested_district_id=district_id)
    cache_key = f"map:hotspots:{district_id or 'all'}:{category_id or 'all'}:{days}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    from app.services.map_service import get_hotspots
    result = await get_hotspots(db, district_id, category_id, days)
    await cache_set(cache_key, result, 3600)
    return result


@router.get("/cases", response_model=list[CaseMapPin])
async def get_cases_in_bounds(
    north: float, south: float, east: float, west: float,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.map_service import get_cases_in_bounds
    return await get_cases_in_bounds(db, north, south, east, west)


@router.get("/temporal-pattern", response_model=TemporalPattern)
async def get_temporal_pattern(
    district_id: int | None = None,
    category_id: int | None = None,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    validate_scope(user, requested_district_id=district_id)
    cache_key = f"map:temporal:{district_id or 'all'}:{category_id or 'all'}"
    cached = await cache_get(cache_key)
    if cached:
        return cached
    from app.services.map_service import get_temporal_pattern
    result = await get_temporal_pattern(db, district_id, category_id)
    await cache_set(cache_key, result, 600)
    return result
