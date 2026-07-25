"""
Crime Number & Case Number Generation Service
Enforces Business Rules for Karnataka Police FIR System:

Crime Number Format:
CategoryCode(2) + DistrictID(3) + UnitID(4) + Year(4) + RunningSerial(5)
Example: 104430006202600001

Serial resets every calendar year per (UnitID, CaseCategoryCode).
"""

from datetime import datetime
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


class CrimeNumberService:
    @staticmethod
    async def generate_crime_number(
        db: AsyncSession,
        category_code: str,
        district_id: int,
        unit_id: int,
        year: int = None
    ) -> str:
        if not year:
            year = datetime.now().year

        cat_str = str(category_code).zfill(2)
        dist_str = str(district_id).zfill(3)
        unit_str = str(unit_id).zfill(4)
        year_str = str(year)

        # Atomic sequence lookup per Unit + Category + Year
        query = text("""
            SELECT COUNT(*) + 1 
            FROM case_masters 
            WHERE unit_id = :unit_id 
              AND case_category_id = (SELECT category_id FROM case_categories WHERE category_code = :cat_code)
              AND EXTRACT(YEAR FROM crime_registered_date) = :year
        """)

        result = await db.execute(query, {
            "unit_id": unit_id,
            "cat_code": category_code,
            "year": year
        })
        next_serial = result.scalar() or 1
        serial_str = str(next_serial).zfill(5)

        crime_number = f"{cat_str}{dist_str}{unit_str}{year_str}{serial_str}"
        return crime_number

    @staticmethod
    async def generate_case_number(
        db: AsyncSession,
        year: int = None
    ) -> str:
        if not year:
            year = datetime.now().year

        year_str = str(year)
        query = text("""
            SELECT COUNT(*) + 1 
            FROM case_masters 
            WHERE EXTRACT(YEAR FROM crime_registered_date) = :year
        """)

        result = await db.execute(query, {"year": year})
        next_serial = result.scalar() or 1
        serial_str = str(next_serial).zfill(6)

        return f"{year_str}{serial_str}"
