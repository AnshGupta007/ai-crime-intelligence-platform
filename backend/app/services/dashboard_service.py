from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def get_summary_kpis(db: AsyncSession, district_id: int | None = None):
    params = {}
    join_clause = ""
    where_clause = ""
    district_filter = ""
    if district_id:
        join_clause = "JOIN units u ON cm.police_station_id = u.unit_id"
        where_clause = "WHERE u.district_id = :district_id"
        district_filter = "AND u.district_id = :district_id"
        params["district_id"] = district_id

    row = (await db.execute(text(f"""
        SELECT
            (SELECT COUNT(*) FROM case_masters cm {join_clause} {where_clause}) AS total_firs,
            (SELECT COUNT(*) FROM case_masters cm {join_clause} WHERE cm.crime_registered_date = CURRENT_DATE {district_filter}) AS today_firs,
            (SELECT COUNT(*) FROM crime_hotspots {("WHERE district_id = :district_id" if district_id else "")}) AS active_hotspots,
            (SELECT COUNT(*) FROM alerts WHERE is_read = FALSE AND severity = 'CRITICAL' {("AND district_id = :district_id" if district_id else "")}) AS critical_alerts,
            (SELECT ROUND(
                (SELECT COUNT(*) FROM case_masters cm {join_clause} WHERE cm.crime_registered_date >= DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01') AND cm.crime_registered_date < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') {district_filter})
                /
                NULLIF((SELECT COUNT(*) FROM case_masters cm {join_clause} WHERE cm.crime_registered_date >= DATE_FORMAT(CURRENT_DATE - INTERVAL 2 MONTH, '%Y-%m-01') AND cm.crime_registered_date < DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01') {district_filter}), 0)
                * 100 - 100, 1)
            ) AS mom_change
    """), params)).fetchone()
    return {
        "total_firs": row[0],
        "today_firs": row[1],
        "active_hotspots": row[2],
        "critical_alerts": row[3],
        "mom_change": row[4] or 0,
        "yoy_change": 0,
    }


async def get_trends(db: AsyncSession, months: int):
    rows = (await db.execute(text("""
        SELECT
            DATE(crime_registered_date) AS date,
            COUNT(*) AS count
        FROM case_masters
        WHERE crime_registered_date >= CURRENT_DATE - INTERVAL :months MONTH
        GROUP BY DATE(crime_registered_date)
        ORDER BY date
    """), {"months": months})).fetchall()
    return {"points": [{"date": str(r[0]), "count": r[1]} for r in rows]}


async def get_crime_categories(db: AsyncSession):
    total = (await db.execute(text("SELECT COUNT(*) FROM case_masters"))).scalar() or 1
    rows = (await db.execute(text("""
        SELECT ch.crime_group_name AS category, COUNT(*) AS count
        FROM case_masters cm
        JOIN crime_heads ch ON cm.crime_major_head_id = ch.crime_head_id
        GROUP BY ch.crime_group_name
        ORDER BY count DESC
        LIMIT 5
    """))).fetchall()
    return [{"category": r[0], "count": r[1], "percentage": round(r[1] / total * 100, 1)} for r in rows]


async def get_recent_alerts(db: AsyncSession, limit: int):
    rows = (await db.execute(text("""
        SELECT alert_id, title, severity, description, CAST(created_at AS CHAR) AS created_at
        FROM alerts
        ORDER BY created_at DESC
        LIMIT :limit
    """), {"limit": limit})).fetchall()
    return [{"alert_id": r[0], "title": r[1], "severity": r[2], "description": r[3], "created_at": r[4]} for r in rows]


async def get_recent_cases(db: AsyncSession, limit: int):
    rows = (await db.execute(text("""
        SELECT cm.case_master_id, cm.crime_no, CAST(cm.crime_registered_date AS CHAR) AS crime_registered_date,
               ch.crime_group_name, d.district_name, csm.case_status_name
        FROM case_masters cm
        JOIN crime_heads ch ON cm.crime_major_head_id = ch.crime_head_id
        JOIN units u ON cm.police_station_id = u.unit_id
        JOIN districts d ON u.district_id = d.district_id
        LEFT JOIN case_status_masters csm ON cm.case_status_id = csm.case_status_id
        ORDER BY cm.created_at DESC
        LIMIT :limit
    """), {"limit": limit})).fetchall()
    return [{"case_master_id": r[0], "crime_no": r[1], "date": r[2], "type": r[3], "district": r[4], "status": r[5]} for r in rows]


async def mark_alert_read(db: AsyncSession, alert_id: int):
    await db.execute(text("UPDATE alerts SET is_read = TRUE WHERE alert_id = :id"), {"id": alert_id})
    await db.commit()
    return {"message": "Alert marked as read"}
