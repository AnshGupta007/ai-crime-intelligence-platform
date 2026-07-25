from sqlalchemy import Column, Integer, String, DECIMAL, Boolean, ForeignKey, text
from sqlalchemy.dialects.postgresql import JSONB

from app.database import Base


class State(Base):
    __tablename__ = "states"

    state_id = Column(Integer, primary_key=True, autoincrement=True)
    state_name = Column(String(100))
    nationality_id = Column(Integer)
    active = Column(Boolean, default=True)


class District(Base):
    __tablename__ = "districts"

    district_id = Column(Integer, primary_key=True, autoincrement=True)
    district_name = Column(String(100))
    state_id = Column(Integer, ForeignKey("states.state_id"))
    active = Column(Boolean, default=True)
    boundary_geojson = Column(JSONB)


class Unit(Base):
    __tablename__ = "units"

    unit_id = Column(Integer, primary_key=True, autoincrement=True)
    unit_name = Column(String(255))
    type_id = Column(Integer, ForeignKey("unit_types.unit_type_id"))
    parent_unit = Column(Integer, ForeignKey("units.unit_id"))
    state_id = Column(Integer, ForeignKey("states.state_id"))
    district_id = Column(Integer, ForeignKey("districts.district_id"))
    active = Column(Boolean, default=True)
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
