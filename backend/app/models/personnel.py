from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey

from app.database import Base


class Rank(Base):
    __tablename__ = "ranks"

    rank_id = Column(Integer, primary_key=True, autoincrement=True)
    rank_name = Column(String(100))
    hierarchy = Column(Integer)
    active = Column(Boolean, default=True)


class Designation(Base):
    __tablename__ = "designations"

    designation_id = Column(Integer, primary_key=True, autoincrement=True)
    designation_name = Column(String(100))
    active = Column(Boolean, default=True)
    sort_order = Column(Integer)


class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(Integer, ForeignKey("districts.district_id"))
    unit_id = Column(Integer, ForeignKey("units.unit_id"))
    rank_id = Column(Integer, ForeignKey("ranks.rank_id"))
    designation_id = Column(Integer, ForeignKey("designations.designation_id"))
    kgid = Column(String(50))
    first_name = Column(String(100))
    employee_dob = Column(Date)
    gender_id = Column(Integer)
    blood_group_id = Column(Integer)
    physically_challenged = Column(Boolean, default=False)
    appointment_date = Column(Date)
