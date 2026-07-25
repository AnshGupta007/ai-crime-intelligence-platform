from pydantic import BaseModel


class SummaryKPIs(BaseModel):
    total_firs: int
    today_firs: int
    active_hotspots: int
    critical_alerts: int
    mom_change: float
    yoy_change: float


class TrendDataPoint(BaseModel):
    date: str
    count: int
    category: str | None = None


class TrendData(BaseModel):
    points: list[TrendDataPoint]


class CategoryBreakdown(BaseModel):
    category: str
    count: int
    percentage: float


class AlertOut(BaseModel):
    alert_id: int
    title: str
    severity: str
    description: str | None = None
    created_at: str | None = None
