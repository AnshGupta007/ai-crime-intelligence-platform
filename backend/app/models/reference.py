from sqlalchemy import Column, Integer, String, Boolean, ForeignKey

from app.database import Base


class CasteMaster(Base):
    __tablename__ = "caste_masters"

    caste_master_id = Column(Integer, primary_key=True, autoincrement=True)
    caste_master_name = Column(String(100))


class ReligionMaster(Base):
    __tablename__ = "religion_masters"

    religion_id = Column(Integer, primary_key=True, autoincrement=True)
    religion_name = Column(String(100))


class OccupationMaster(Base):
    __tablename__ = "occupation_masters"

    occupation_id = Column(Integer, primary_key=True, autoincrement=True)
    occupation_name = Column(String(100))


class UnitType(Base):
    __tablename__ = "unit_types"

    unit_type_id = Column(Integer, primary_key=True, autoincrement=True)
    unit_type_name = Column(String(100))
    city_dist_state = Column(String(50))
    hierarchy = Column(Integer)
    active = Column(Boolean, default=True)


class Court(Base):
    __tablename__ = "courts"

    court_id = Column(Integer, primary_key=True, autoincrement=True)
    court_name = Column(String(255))
    district_id = Column(Integer, ForeignKey("districts.district_id"))
    state_id = Column(Integer, ForeignKey("states.state_id"))
    active = Column(Boolean, default=True)


class CaseStatusMaster(Base):
    __tablename__ = "case_status_masters"

    case_status_id = Column(Integer, primary_key=True, autoincrement=True)
    case_status_name = Column(String(100))


class CaseCategory(Base):
    __tablename__ = "case_categories"

    case_category_id = Column(Integer, primary_key=True, autoincrement=True)
    lookup_value = Column(String(50))


class GravityOffence(Base):
    __tablename__ = "gravity_offences"

    gravity_offence_id = Column(Integer, primary_key=True, autoincrement=True)
    lookup_value = Column(String(50))
