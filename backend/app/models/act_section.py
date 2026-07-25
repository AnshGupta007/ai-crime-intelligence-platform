from sqlalchemy import Column, Integer, String, ForeignKey, ForeignKeyConstraint, Boolean, Text

from app.database import Base


class Act(Base):
    __tablename__ = "acts"

    act_code = Column(String(20), primary_key=True)
    act_description = Column(String(500))
    short_name = Column(String(50))
    active = Column(Boolean, default=True)


class Section(Base):
    __tablename__ = "sections"

    act_code = Column(String(20), ForeignKey("acts.act_code"), primary_key=True)
    section_code = Column(String(20), primary_key=True)
    section_description = Column(String(500))
    active = Column(Boolean, default=True)


class ActSectionAssociation(Base):
    __tablename__ = "act_section_associations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_master_id = Column(Integer, ForeignKey("case_masters.case_master_id"))
    act_id = Column(String(20), ForeignKey("acts.act_code"))
    section_id = Column(String(20))
    act_order_id = Column(Integer)
    section_order_id = Column(Integer)
    __table_args__ = (
        ForeignKeyConstraint(
            ["act_id", "section_id"],
            ["sections.act_code", "sections.section_code"],
        ),
    )
