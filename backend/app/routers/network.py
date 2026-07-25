from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.schemas.network import NetworkGraph, RepeatOffender

router = APIRouter(prefix="/network", tags=["network"])


@router.get("/accused/{accused_id}", response_model=NetworkGraph)
async def get_accused_network(
    accused_id: int,
    depth: int = Query(2, ge=1, le=5),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.network_service import get_accused_network
    return await get_accused_network(db, accused_id, depth)


@router.get("/communities")
async def get_communities(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.network_service import detect_communities
    return await detect_communities(db)


@router.get("/repeat-offenders", response_model=list[RepeatOffender])
async def get_repeat_offenders(
    min_cases: int = Query(2, ge=1),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.network_service import get_repeat_offenders
    return await get_repeat_offenders(db, min_cases)


@router.get("/search")
async def search_accused(
    q: str = Query("", min_length=1),
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.network_service import search_accused
    return await search_accused(db, q)
