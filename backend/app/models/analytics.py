from sqlalchemy import Column, Integer, String, Date, DateTime, DECIMAL, Boolean, ForeignKey, Text, text

from app.database import Base


class CrimeHotspot(Base):
    __tablename__ = "crime_hotspots"

    hotspot_id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(Integer, ForeignKey("districts.district_id"))
    police_station_id = Column(Integer, ForeignKey("units.unit_id"))
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    crime_category_id = Column(Integer, ForeignKey("case_categories.case_category_id"))
    crime_head_id = Column(Integer, ForeignKey("crime_heads.crime_head_id"))
    hotspot_radius_meters = Column(Integer)
    incident_count = Column(Integer)
    risk_score = Column(DECIMAL(5, 2))
    computed_date = Column(Date)
    valid_until = Column(Date)


class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    prediction_id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(Integer, ForeignKey("districts.district_id"))
    police_station_id = Column(Integer, ForeignKey("units.unit_id"))
    crime_category_id = Column(Integer, ForeignKey("case_categories.case_category_id"))
    prediction_date = Column(Date)
    forecast_date = Column(Date)
    predicted_incidents = Column(Integer)
    confidence_interval_low = Column(DECIMAL(5, 2))
    confidence_interval_high = Column(DECIMAL(5, 2))
    risk_level = Column(String(10))
    model_version = Column(String(20))


class AnomalyDetection(Base):
    __tablename__ = "anomaly_detections"

    anomaly_id = Column(Integer, primary_key=True, autoincrement=True)
    case_master_id = Column(Integer, ForeignKey("case_masters.case_master_id"))
    anomaly_type = Column(String(50))
    anomaly_score = Column(DECIMAL(5, 4))
    description = Column(Text)
    detected_at = Column(DateTime, server_default=text("NOW()"))
    reviewed = Column(Boolean, default=False)
    reviewed_by = Column(Integer, ForeignKey("employees.employee_id"))


class MOPattern(Base):
    __tablename__ = "mo_patterns"

    pattern_id = Column(Integer, primary_key=True, autoincrement=True)
    accused_master_id = Column(Integer, ForeignKey("accused.accused_master_id"))
    pattern_signature = Column(Text)
    associated_cases = Column(Text)
    first_seen = Column(Date)
    last_seen = Column(Date)
    evolution_score = Column(DECIMAL(5, 2))


class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(Integer, primary_key=True, autoincrement=True)
    alert_type = Column(String(50))
    severity = Column(String(20))
    district_id = Column(Integer, ForeignKey("districts.district_id"))
    police_station_id = Column(Integer, ForeignKey("units.unit_id"))
    title = Column(String(255))
    description = Column(Text)
    data = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=text("NOW()"))
