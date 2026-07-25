from pydantic import BaseModel


class DistrictDensity(BaseModel):
    district_id: int
    district_name: str
    count: int
    density: float | None = None


class HotspotOut(BaseModel):
    hotspot_id: int
    latitude: float
    longitude: float
    radius_meters: int | None = None
    incident_count: int
    risk_score: float | None = None


class CaseMapPin(BaseModel):
    case_master_id: int
    crime_no: str
    latitude: float
    longitude: float
    crime_head: str | None = None


class TemporalPattern(BaseModel):
    hourly: list[int]
    weekly: list[int]
