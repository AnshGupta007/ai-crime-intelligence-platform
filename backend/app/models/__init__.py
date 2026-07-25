from app.models.base import Base
from app.models.case_master import CaseMaster
from app.models.complainant import ComplainantDetail
from app.models.victim import Victim
from app.models.accused import Accused
from app.models.arrest_surrender import ArrestSurrender
from app.models.act_section import Act, Section, ActSectionAssociation
from app.models.crime_classification import CrimeHead, CrimeSubHead
from app.models.geography import State, District, Unit
from app.models.personnel import Employee, Rank, Designation
from app.models.reference import (
    CasteMaster,
    ReligionMaster,
    OccupationMaster,
    UnitType,
    Court,
    CaseStatusMaster,
    CaseCategory,
    GravityOffence,
)
from app.models.user import User
from app.models.analytics import CrimeHotspot, RiskPrediction, AnomalyDetection, MOPattern, Alert

__all__ = [
    "Base",
    "CaseMaster",
    "ComplainantDetail",
    "Victim",
    "Accused",
    "ArrestSurrender",
    "Act",
    "Section",
    "ActSectionAssociation",
    "CrimeHead",
    "CrimeSubHead",
    "State",
    "District",
    "Unit",
    "Employee",
    "Rank",
    "Designation",
    "CasteMaster",
    "ReligionMaster",
    "OccupationMaster",
    "UnitType",
    "Court",
    "CaseStatusMaster",
    "CaseCategory",
    "GravityOffence",
    "CrimeHotspot",
    "RiskPrediction",
    "AnomalyDetection",
    "MOPattern",
    "Alert",
    "User",
]
