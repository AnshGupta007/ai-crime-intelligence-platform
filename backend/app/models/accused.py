from sqlalchemy import Column, Integer, String, ForeignKey, Index

from app.database import Base


class Accused(Base):
    __tablename__ = "accused"
    __table_args__ = (
        Index("ix_accused_accused_name", "accused_name"),
    )

    accused_master_id = Column(Integer, primary_key=True, autoincrement=True)
    case_master_id = Column(Integer, ForeignKey("case_masters.case_master_id"))
    accused_name = Column(String(255))
    age_year = Column(Integer)
    gender_id = Column(Integer)
    person_id = Column(String(10))
