from datetime import date, datetime
from pydantic import BaseModel


class CaseOut(BaseModel):
    case_master_id: int
    crime_no: str
    case_no: str
    crime_registered_date: date
    fir_status: str | None = None
    district_name: str | None = None
    crime_head_description: str | None = None
    brief_facts: str | None = None
    latitude: float | None = None
    longitude: float | None = None

    model_config = {"from_attributes": True}


class CaseList(BaseModel):
    cases: list[CaseOut]
    total: int
    page: int
    limit: int


class CaseDetail(BaseModel):
    case_master_id: int
    crime_no: str
    case_no: str
    crime_registered_date: date
    incident_from_date: datetime | None = None
    incident_to_date: datetime | None = None
    latitude: float | None = None
    longitude: float | None = None
    brief_facts: str | None = None
    fir_status: str | None = None
    district_name: str | None = None
    police_station_name: str | None = None
    crime_head_description: str | None = None

    model_config = {"from_attributes": True}
