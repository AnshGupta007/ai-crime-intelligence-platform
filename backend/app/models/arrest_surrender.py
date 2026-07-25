from sqlalchemy import Column, Integer, Date, ForeignKey, Boolean

from app.database import Base


class ArrestSurrender(Base):
    __tablename__ = "arrest_surrenders"

    arrest_surrender_id = Column(Integer, primary_key=True, autoincrement=True)
    case_master_id = Column(Integer, ForeignKey("case_masters.case_master_id"))
    arrest_surrender_type_id = Column(Integer)
    arrest_surrender_date = Column(Date)
    arrest_surrender_state_id = Column(Integer, ForeignKey("states.state_id"))
    arrest_surrender_district_id = Column(Integer, ForeignKey("districts.district_id"))
    police_station_id = Column(Integer, ForeignKey("units.unit_id"))
    io_id = Column(Integer, ForeignKey("employees.employee_id"))
    court_id = Column(Integer, ForeignKey("courts.court_id"))
    accused_master_id = Column(Integer, ForeignKey("accused.accused_master_id"))
    is_accused = Column(Boolean, default=False)
    is_complainant_accused = Column(Boolean, default=False)
