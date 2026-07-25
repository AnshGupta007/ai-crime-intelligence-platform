from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user, validate_scope, get_user_scope
from app.database import get_db
from app.schemas.case import CaseList, CaseDetail

router = APIRouter(prefix="/cases", tags=["cases"])


@router.get("", response_model=CaseList)
async def list_cases(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    district: int | None = None,
    status: str | None = None,
    crime_head: int | None = None,
    search: str | None = None,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    validate_scope(user, requested_district_id=district)
    scope = get_user_scope(user)
    effective_district = district or scope["district_id"]
    from app.services.case_service import get_cases
    return await get_cases(db, page, limit, effective_district, status, crime_head, search)


@router.get("/{case_id}", response_model=CaseDetail)
async def get_case(
    case_id: int,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.case_service import get_case_detail
    return await get_case_detail(db, case_id)


@router.get("/{case_id}/network")
async def get_case_network(
    case_id: int,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.network_service import get_case_network
    return await get_case_network(db, case_id)

