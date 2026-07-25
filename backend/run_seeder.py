import asyncio
import sys

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.database import engine
from app.seeders.data_seeder import DataSeeder


async def main():
    count = 7000
    if len(sys.argv) > 1:
        count = int(sys.argv[1])

    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        seeder = DataSeeder(session)
        print(f"Seeding {count} cases...")
        await seeder.seed_all()
        print("Seeding complete!")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
