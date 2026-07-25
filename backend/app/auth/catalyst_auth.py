"""
Catalyst Authentication integration module.

This provides an alternative auth flow using Catalyst Authentication.
When CATALYST_AUTH_ENABLED=true, the app validates tokens via Catalyst
instead of the custom JWT system.

To use Catalyst Auth:
1. Enable in Catalyst Console: Project > Authentication > Enable
2. Set CATALYST_AUTH_ENABLED=true in environment
3. Configure allowed redirect URIs in Catalyst Console
"""

import os
import json
import logging

from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

logger = logging.getLogger(__name__)

CATALYST_AUTH_ENABLED = os.getenv("CATALYST_AUTH_ENABLED", "false").lower() == "true"

try:
    from catalyst.auth import UserManagement
    from catalyst.auth import TokenDecoder
    CATALYST_SDK_AVAILABLE = True
except ImportError:
    CATALYST_SDK_AVAILABLE = False
    CATALYST_AUTH_ENABLED = False

security = HTTPBearer()


async def get_catalyst_user(credentials: HTTPAuthorizationCredentials = security) -> dict:
    if not CATALYST_SDK_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Catalyst SDK not available"
        )

    try:
        token = credentials.credentials
        decoder = TokenDecoder()
        user_details = decoder.decode(token)

        return {
            "user_id": user_details.get("user_id"),
            "username": user_details.get("email", user_details.get("username", "unknown")),
            "role": user_details.get("role", "SCRB"),
            "district_id": user_details.get("district_id"),
            "station_id": user_details.get("station_id"),
            "is_catalyst_auth": True,
        }
    except Exception as e:
        logger.error(f"Catalyst auth failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Catalyst authentication token",
        )
