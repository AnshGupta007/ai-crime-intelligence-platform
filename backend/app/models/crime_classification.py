from sqlalchemy import Column, Integer, String, Boolean, ForeignKey

from app.database import Base


class CrimeHead(Base):
    __tablename__ = "crime_heads"

    crime_head_id = Column(Integer, primary_key=True, autoincrement=True)
    crime_group_name = Column(String(255))
    active = Column(Boolean, default=True)


class CrimeSubHead(Base):
    __tablename__ = "crime_sub_heads"

    crime_sub_head_id = Column(Integer, primary_key=True, autoincrement=True)
    crime_head_id = Column(Integer, ForeignKey("crime_heads.crime_head_id"))
    crime_head_name = Column(String(255))
    seq_id = Column(Integer)
