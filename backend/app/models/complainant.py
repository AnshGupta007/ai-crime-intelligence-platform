from sqlalchemy import Column, Integer, String, ForeignKey

from app.database import Base


class ComplainantDetail(Base):
    __tablename__ = "complainant_details"

    complainant_id = Column(Integer, primary_key=True, autoincrement=True)
    case_master_id = Column(Integer, ForeignKey("case_masters.case_master_id"))
    complainant_name = Column(String(255))
    age_year = Column(Integer)
    occupation_id = Column(Integer, ForeignKey("occupation_masters.occupation_id"))
    religion_id = Column(Integer, ForeignKey("religion_masters.religion_id"))
    caste_id = Column(Integer, ForeignKey("caste_masters.caste_master_id"))
    gender_id = Column(Integer)
