from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def get_district_crime_density(db: AsyncSession):
    rows = (await db.execute(text("""
        SELECT d.district_id, d.district_name, COUNT(cm.case_master_id) AS count
        FROM districts d
        LEFT JOIN units u ON u.district_id = d.district_id
        LEFT JOIN case_masters cm ON cm.police_station_id = u.unit_id
            AND cm.crime_registered_date >= CURRENT_DATE - INTERVAL 30 DAY
        GROUP BY d.district_id, d.district_name
        ORDER BY count DESC
    """))).fetchall()
    return [{"district_id": r[0], "district_name": r[1], "count": r[2], "density": round(r[2] / 100.0, 2)} for r in rows]


async def get_district_density_detail(db: AsyncSession, district_id: int):
    row = (await db.execute(text("""
        SELECT d.district_id, d.district_name, COUNT(cm.case_master_id) AS count
        FROM districts d
        LEFT JOIN units u ON u.district_id = d.district_id
        LEFT JOIN case_masters cm ON cm.police_station_id = u.unit_id
        WHERE d.district_id = :id
        GROUP BY d.district_id, d.district_name
    """), {"id": district_id})).fetchone()
    if row:
        return {"district_id": row[0], "district_name": row[1], "count": row[2], "density": round(row[2] / 100.0, 2)}
    return None


async def get_hotspots(db: AsyncSession, district_id: int | None, category_id: int | None, days: int):
    query = """
        SELECT hotspot_id, CAST(latitude AS DECIMAL(10,8)) AS latitude, CAST(longitude AS DECIMAL(11,8)) AS longitude, hotspot_radius_meters,
               incident_count, CAST(risk_score AS DECIMAL(5,2)) AS risk_score
        FROM crime_hotspots
        WHERE computed_date >= CURRENT_DATE - INTERVAL :days DAY
    """
    params: dict = {"days": days}
    if district_id:
        query += " AND district_id = :district_id"
        params["district_id"] = district_id
    if category_id:
        query += " AND crime_category_id = :category_id"
        params["category_id"] = category_id

    rows = (await db.execute(text(query), params)).fetchall()
    return [
        {"hotspot_id": r[0], "latitude": float(r[1]), "longitude": float(r[2]),
         "radius_meters": r[3], "incident_count": r[4], "risk_score": float(r[5])}
        for r in rows
    ]


async def get_cases_in_bounds(db: AsyncSession, north: float, south: float, east: float, west: float):
    rows = (await db.execute(text("""
        SELECT cm.case_master_id, cm.crime_no, CAST(cm.latitude AS DECIMAL(10,8)) AS latitude, CAST(cm.longitude AS DECIMAL(11,8)) AS longitude, ch.crime_group_name
        FROM case_masters cm
        JOIN crime_heads ch ON cm.crime_major_head_id = ch.crime_head_id
        WHERE cm.latitude BETWEEN :south AND :north
          AND cm.longitude BETWEEN :west AND :east
    """), {"north": north, "south": south, "east": east, "west": west})).fetchall()
    return [{"case_master_id": r[0], "crime_no": r[1], "latitude": float(r[2]), "longitude": float(r[3]), "crime_head": r[4]} for r in rows]


async def get_temporal_pattern(db: AsyncSession, district_id: int | None, category_id: int | None):
    hourly = [0] * 24
    weekly = [0] * 7

    params: dict = {}
    conditions = []
    if district_id:
        conditions.append("u.district_id = :district_id")
        params["district_id"] = district_id
    if category_id:
        conditions.append("cm.crime_major_head_id = :category_id")
        params["category_id"] = category_id

    where_clause = " AND " + " AND ".join(conditions) if conditions else ""

    hourly_rows = (await db.execute(text(f"""
        SELECT CAST(EXTRACT(HOUR FROM incident_from_date) AS SIGNED) AS hour, COUNT(*) AS count
        FROM case_masters cm
        JOIN units u ON cm.police_station_id = u.unit_id
        WHERE incident_from_date IS NOT NULL{where_clause}
        GROUP BY hour ORDER BY hour
    """), params)).fetchall()

    for r in hourly_rows:
        if 0 <= r[0] <= 23:
            hourly[r[0]] = r[1]

    weekly_rows = (await db.execute(text(f"""
        SELECT CAST(DAYOFWEEK(crime_registered_date) - 1 AS SIGNED) AS dow, COUNT(*) AS count
        FROM case_masters cm
        JOIN units u ON cm.police_station_id = u.unit_id
        WHERE 1=1{where_clause}
        GROUP BY dow ORDER BY dow
    """), params)).fetchall()

    for r in weekly_rows:
        if 0 <= r[0] <= 6:
            weekly[r[0]] = r[1]

    return {"hourly": hourly, "weekly": weekly}
