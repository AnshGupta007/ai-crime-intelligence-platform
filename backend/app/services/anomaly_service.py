from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def get_recent_anomalies(db: AsyncSession, limit: int):
    rows = (await db.execute(text("""
        SELECT anomaly_id, anomaly_type, anomaly_score::float, description,
               detected_at::text, reviewed
        FROM anomaly_detections
        ORDER BY detected_at DESC
        LIMIT :limit
    """), {"limit": limit})).fetchall()
    return [{"anomaly_id": r[0], "anomaly_type": r[1], "anomaly_score": r[2],
             "description": r[3], "detected_at": r[4], "reviewed": r[5]} for r in rows]


async def get_anomaly_detail(db: AsyncSession, anomaly_id: int):
    row = (await db.execute(text("""
        SELECT anomaly_id, anomaly_type, anomaly_score::float, description,
               detected_at::text, reviewed
        FROM anomaly_detections
        WHERE anomaly_id = :id
    """), {"id": anomaly_id})).fetchone()
    if row:
        return {"anomaly_id": row[0], "anomaly_type": row[1], "anomaly_score": row[2],
                "description": row[3], "detected_at": row[4], "reviewed": row[5]}
    return None


async def mark_as_reviewed(db: AsyncSession, anomaly_id: int):
    await db.execute(text("UPDATE anomaly_detections SET reviewed = TRUE WHERE anomaly_id = :id"), {"id": anomaly_id})
    await db.commit()
    return {"message": "Anomaly marked as reviewed"}
