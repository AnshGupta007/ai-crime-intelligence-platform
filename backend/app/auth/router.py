from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.auth.schemas import UserLogin, UserRegister, TokenOut, UserOut
from app.auth.utils import hash_password, verify_password, create_access_token
from app.config import settings
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    existing = (await db.execute(
        text("SELECT user_id FROM users WHERE username = :username"),
        {"username": data.username},
    )).fetchone()

    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")

    hashed = hash_password(data.password)
    await db.execute(
        text(
            "INSERT INTO users (username, hashed_password, role, district_id, station_id) "
            "VALUES (:username, :password, :role, :district_id, :station_id)"
        ),
        {
            "username": data.username,
            "password": hashed,
            "role": data.role,
            "district_id": data.district_id,
            "station_id": data.station_id,
        },
    )
    await db.commit()
    return {"message": "User created"}


@router.post("/login", response_model=TokenOut)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    row = (
        await db.execute(
            text("SELECT user_id, username, hashed_password, role, district_id, station_id, is_active FROM users WHERE username = :username"),
            {"username": data.username},
        )
    ).fetchone()

    if not row or not verify_password(data.password, row[2]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not row[6]:
        raise HTTPException(status_code=403, detail="Account is inactive")

    token = create_access_token({
        "user_id": row[0],
        "username": row[1],
        "role": row[3],
        "district_id": row[4],
        "station_id": row[5],
    })
    return TokenOut(access_token=token, expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)


@router.get("/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(
        user_id=user["user_id"],
        username=user["username"],
        role=user["role"],
        district_id=user.get("district_id"),
        station_id=user.get("station_id"),
    )
