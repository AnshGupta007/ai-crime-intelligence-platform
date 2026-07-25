from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.auth.utils import decode_access_token

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        payload = decode_access_token(credentials.credentials)
        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


def require_role(allowed_roles: list[str]):
    async def role_checker(user: dict = Depends(get_current_user)) -> dict:
        if user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return user

    return role_checker


async def require_role_scoped(
    allowed_roles: list[str],
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    try:
        user = decode_access_token(credentials.credentials)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    if user.get("role") not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )

    return user


def get_user_scope(user: dict) -> dict:
    role = user.get("role", "")
    scope = {"role": role, "district_id": None, "station_id": None, "is_restricted": False}

    if role == "SCRB":
        scope["district_id"] = None
        scope["station_id"] = None
        scope["is_restricted"] = False
    elif role == "SP":
        scope["district_id"] = user.get("district_id")
        scope["station_id"] = None
        scope["is_restricted"] = True
    elif role == "IO":
        scope["district_id"] = user.get("district_id")
        scope["station_id"] = user.get("station_id")
        scope["is_restricted"] = True

    return scope


def validate_scope(user: dict, requested_district_id: int | None = None, requested_station_id: int | None = None):
    role = user.get("role")
    if role == "SCRB":
        return

    if role == "SP":
        user_district = user.get("district_id")
        if requested_district_id is not None and user_district is not None and int(requested_district_id) != int(user_district):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: SP role is restricted to their assigned district",
            )
    elif role == "IO":
        user_district = user.get("district_id")
        user_station = user.get("station_id")
        if requested_district_id is not None and user_district is not None and int(requested_district_id) != int(user_district):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: IO role is restricted to their assigned district",
            )
        if requested_station_id is not None and user_station is not None and int(requested_station_id) != int(user_station):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: IO role is restricted to their assigned police station",
            )

