from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/generate")
async def generate_report(
    data: dict,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.report_service import generate_report
    return await generate_report(db, data)


@router.get("/{report_id}/download")
async def download_report(
    report_id: str,
    user: dict = Depends(get_current_user),
):
    from app.services.report_service import download_report
    return await download_report(report_id)
