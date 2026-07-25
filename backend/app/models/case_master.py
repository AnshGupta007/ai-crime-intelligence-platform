from sqlalchemy import Column, Integer, String, Date, DateTime, Text, DECIMAL, ForeignKey, Boolean, text, Index

from app.database import Base


class CaseMaster(Base):
    __tablename__ = "case_masters"
    __table_args__ = (
        Index("ix_case_masters_crime_registered_date", "crime_registered_date"),
        Index("ix_case_masters_police_station_id", "police_station_id"),
        Index("ix_case_masters_location", "latitude", "longitude"),
    )

    case_master_id = Column(Integer, primary_key=True, autoincrement=True)
    crime_no = Column(String(25), unique=True, nullable=False)
    case_no = Column(String(15), nullable=False)
    crime_registered_date = Column(Date, nullable=False)
    police_person_id = Column(Integer, ForeignKey("employees.employee_id"))
    police_station_id = Column(Integer, ForeignKey("units.unit_id"))
    case_category_id = Column(Integer, ForeignKey("case_categories.case_category_id"))
    gravity_offence_id = Column(Integer, ForeignKey("gravity_offences.gravity_offence_id"))
    crime_major_head_id = Column(Integer, ForeignKey("crime_heads.crime_head_id"))
    crime_minor_head_id = Column(Integer, ForeignKey("crime_sub_heads.crime_sub_head_id"))
    case_status_id = Column(Integer, ForeignKey("case_status_masters.case_status_id"))
    court_id = Column(Integer, ForeignKey("courts.court_id"))
    incident_from_date = Column(DateTime)
    incident_to_date = Column(DateTime)
    info_received_ps_date = Column(DateTime)
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    brief_facts = Column(Text)
    created_at = Column(DateTime, server_default=text("NOW()"))
