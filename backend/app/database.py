from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

db_url = settings.DATABASE_URL
if "mysql+aiomysql" in db_url:
    db_url = db_url.replace("mysql+aiomysql", "postgresql+asyncpg")
elif "postgresql://" in db_url and "+asyncpg" not in db_url:
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")

try:
    engine = create_async_engine(db_url, echo=False, pool_size=10, max_overflow=20)
except Exception:
    try:
        engine = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/crime_db", echo=False)
    except Exception:
        engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)

async_session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
