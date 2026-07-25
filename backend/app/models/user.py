from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, text

from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(10), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.district_id"))
    station_id = Column(Integer, ForeignKey("units.unit_id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=text("NOW()"))
