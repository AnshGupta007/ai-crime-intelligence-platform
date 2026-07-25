import pandas as pd

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.ml.forecaster import CrimeForecaster
from app.services.ml.risk_scorer import RiskScorer


async def get_crime_forecast(db: AsyncSession, district_id: int | None, category_id: int | None, days: int):
    params: dict = {}
    conditions = []
    if district_id:
        conditions.append("u.district_id = :district_id")
        params["district_id"] = district_id
    if category_id:
        conditions.append("cm.crime_major_head_id = :category_id")
        params["category_id"] = category_id

    where_clause = " AND " + " AND ".join(conditions) if conditions else ""

    rows = (await db.execute(text(f"""
        SELECT crime_registered_date::text, COUNT(*)::int
        FROM case_masters cm
        JOIN units u ON cm.police_station_id = u.unit_id
        WHERE crime_registered_date >= CURRENT_DATE - INTERVAL '365 days'{where_clause}
        GROUP BY crime_registered_date
        ORDER BY crime_registered_date
    """), params)).fetchall()

    if not rows:
        return {"points": [], "district_id": district_id, "category_id": category_id}

    df = pd.DataFrame({"ds": [r[0] for r in rows], "y": [r[1] for r in rows]})
    df["ds"] = pd.to_datetime(df["ds"])
    df = df.sort_values("ds").groupby("ds").sum().reset_index()

    forecaster = CrimeForecaster()
    forecaster.fit(df)
    pred = forecaster.predict(days)

    points = []
    last_date = df["ds"].max()
    for i in range(len(pred)):
        d = last_date + pd.Timedelta(days=i + 1)
        points.append({
            "date": d.strftime("%Y-%m-%d"),
            "predicted": round(float(pred["yhat"].iloc[i]), 1),
            "lower_bound": round(float(pred["yhat_lower"].iloc[i]), 1) if "yhat_lower" in pred else None,
            "upper_bound": round(float(pred["yhat_upper"].iloc[i]), 1) if "yhat_upper" in pred else None,
        })

    return {"points": points, "district_id": district_id, "category_id": category_id}


async def get_risk_scores(db: AsyncSession):
    scorer = RiskScorer()
    rows = (await db.execute(text("""
        SELECT
            d.district_id, d.district_name,
            COALESCE(c30.cnt, 0) AS incident_count_30d,
            COALESCE(c90.cnt, 0) AS incident_count_90d_avg,
            COALESCE(h.cnt, 0) AS hotspot_count,
            COALESCE(r.cnt, 0) AS repeat_offender_count
        FROM districts d
        LEFT JOIN (SELECT u.district_id, COUNT(*) AS cnt
                   FROM case_masters cm JOIN units u ON cm.police_station_id = u.unit_id
                   WHERE cm.crime_registered_date >= CURRENT_DATE - INTERVAL '30 days'
                   GROUP BY u.district_id) c30 ON d.district_id = c30.district_id
        LEFT JOIN (SELECT u.district_id, COUNT(*)::numeric / 3 AS cnt
                   FROM case_masters cm JOIN units u ON cm.police_station_id = u.unit_id
                   WHERE cm.crime_registered_date >= CURRENT_DATE - INTERVAL '90 days'
                   GROUP BY u.district_id) c90 ON d.district_id = c90.district_id
        LEFT JOIN (SELECT district_id, COUNT(*) AS cnt
                   FROM crime_hotspots GROUP BY district_id) h ON d.district_id = h.district_id
        LEFT JOIN (SELECT u.district_id, COUNT(DISTINCT a.accused_master_id) AS cnt
                   FROM accused a
                   JOIN case_masters cm ON a.case_master_id = cm.case_master_id
                   JOIN units u ON cm.police_station_id = u.unit_id
                   GROUP BY u.district_id) r ON d.district_id = r.district_id
        ORDER BY d.district_name
    """))).fetchall()

    results = []
    for r in rows:
        stats = {
            "incident_count_30d": r[2],
            "incident_count_90d_avg": r[3],
            "trend_slope": 0.0,
            "hotspot_count": r[4],
            "repeat_offender_count": r[5],
        }
        risk = scorer.calculate_district_risk(stats)
        results.append({
            "district_id": r[0],
            "district_name": r[1],
            "risk_score": risk["risk_score"],
            "risk_level": risk["risk_level"],
        })

    results.sort(key=lambda x: x["risk_score"], reverse=True)
    return results


async def get_socio_economic(db: AsyncSession, district_id: int | None):
    params: dict = {}
    where_clause = ""
    if district_id:
        where_clause = " WHERE d.district_id = :district_id"
        params["district_id"] = district_id

    rows = (await db.execute(text(f"""
        SELECT d.district_id, d.district_name,
               COUNT(cm.case_master_id) AS crime_count,
               COALESCE(rs.risk_score, 0)::float
        FROM districts d
        LEFT JOIN units u ON u.district_id = d.district_id
        LEFT JOIN case_masters cm ON cm.police_station_id = u.unit_id
            AND cm.crime_registered_date >= CURRENT_DATE - INTERVAL '365 days'
        LEFT JOIN risk_predictions rs ON d.district_id = rs.district_id
        {where_clause}
        GROUP BY d.district_id, d.district_name, rs.risk_score
        ORDER BY crime_count DESC
    """), params)).fetchall()

    data = []
    for r in rows:
        data.append({
            "district_id": r[0],
            "district_name": r[1],
            "crime_count": r[2],
            "risk_score": r[3],
        })

    return {"data": data}
