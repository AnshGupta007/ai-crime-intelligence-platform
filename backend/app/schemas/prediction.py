from pydantic import BaseModel


class ForecastPoint(BaseModel):
    date: str
    predicted: float
    lower_bound: float | None = None
    upper_bound: float | None = None


class ForecastOut(BaseModel):
    points: list[ForecastPoint]
    district_id: int | None = None
    category_id: int | None = None


class RiskScoreOut(BaseModel):
    district_id: int
    district_name: str
    risk_score: float
    risk_level: str
