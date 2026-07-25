from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def get_cases(
    db: AsyncSession,
    page: int = 1,
    limit: int = 20,
    district: int | None = None,
    status: str | None = None,
    crime_head: int | None = None,
    search: str | None = None,
):
    conditions = []
    params = {"offset": (page - 1) * limit, "limit": limit}

    if district:
        conditions.append("u.district_id = :district")
        params["district"] = district
    if status:
        conditions.append("csm.case_status_name = :status")
        params["status"] = status
    if crime_head:
        conditions.append("cm.crime_major_head_id = :crime_head")
        params["crime_head"] = crime_head
    if search:
        conditions.append("(cm.crime_no LIKE :search OR cm.brief_facts LIKE :search)")
        params["search"] = f"%{search}%"

    where_clause = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    count_sql = f"""
        SELECT COUNT(*) FROM case_masters cm
        JOIN units u ON cm.police_station_id = u.unit_id
        LEFT JOIN case_status_masters csm ON cm.case_status_id = csm.case_status_id
        {where_clause}
    """
    total = (await db.execute(text(count_sql), params)).scalar() or 0

    data_sql = f"""
        SELECT cm.case_master_id, cm.crime_no, CAST(cm.crime_registered_date AS CHAR) AS crime_registered_date,
               csm.case_status_name AS fir_status, d.district_name,
               ch.crime_group_name AS crime_head_description,
               cm.brief_facts, CAST(cm.latitude AS DECIMAL(10,8)) AS latitude, CAST(cm.longitude AS DECIMAL(11,8)) AS longitude
        FROM case_masters cm
        JOIN units u ON cm.police_station_id = u.unit_id
        JOIN districts d ON u.district_id = d.district_id
        LEFT JOIN case_status_masters csm ON cm.case_status_id = csm.case_status_id
        LEFT JOIN crime_heads ch ON cm.crime_major_head_id = ch.crime_head_id
        {where_clause}
        ORDER BY cm.created_at DESC
        LIMIT :limit OFFSET :offset
    """
    rows = (await db.execute(text(data_sql), params)).fetchall()

    cases = []
    for r in rows:
        cases.append({
            "case_master_id": r[0],
            "crime_no": r[1],
            "crime_registered_date": r[2],
            "fir_status": r[3],
            "district_name": r[4],
            "crime_head_description": r[5],
            "brief_facts": r[6],
            "latitude": float(r[7]) if r[7] else None,
            "longitude": float(r[8]) if r[8] else None,
        })

    return {"cases": cases, "total": total, "page": page, "limit": limit}


async def get_case_detail(db: AsyncSession, case_id: int):
    row = (await db.execute(text("""
        SELECT cm.case_master_id, cm.crime_no, cm.case_no,
               CAST(cm.crime_registered_date AS CHAR) AS crime_registered_date,
               CAST(cm.incident_from_date AS CHAR) AS incident_from_date,
               CAST(cm.incident_to_date AS CHAR) AS incident_to_date,
               CAST(cm.latitude AS DECIMAL(10,8)) AS latitude,
               CAST(cm.longitude AS DECIMAL(11,8)) AS longitude,
               cm.brief_facts,
               csm.case_status_name AS fir_status,
               d.district_name, u.unit_name AS police_station_name,
               ch.crime_group_name AS crime_head_description
        FROM case_masters cm
        JOIN units u ON cm.police_station_id = u.unit_id
        JOIN districts d ON u.district_id = d.district_id
        LEFT JOIN case_status_masters csm ON cm.case_status_id = csm.case_status_id
        LEFT JOIN crime_heads ch ON cm.crime_major_head_id = ch.crime_head_id
        WHERE cm.case_master_id = :id
    """), {"id": case_id})).fetchone()

    if not row:
        return None

    return {
        "case_master_id": row[0],
        "crime_no": row[1],
        "case_no": row[2],
        "crime_registered_date": row[3],
        "incident_from_date": row[4],
        "incident_to_date": row[5],
        "latitude": float(row[6]) if row[6] else None,
        "longitude": float(row[7]) if row[7] else None,
        "brief_facts": row[8],
        "fir_status": row[9],
        "district_name": row[10],
        "police_station_name": row[11],
        "crime_head_description": row[12],
    }
