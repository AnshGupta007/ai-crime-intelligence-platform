from sqlalchemy import Column, Integer, String, ForeignKey

from app.database import Base


class Victim(Base):
    __tablename__ = "victims"

    victim_master_id = Column(Integer, primary_key=True, autoincrement=True)
    case_master_id = Column(Integer, ForeignKey("case_masters.case_master_id"))
    victim_name = Column(String(255))
    age_year = Column(Integer)
    gender_id = Column(Integer)
    victim_police = Column(String(1), default="0")
