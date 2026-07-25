"""
Catalyst initialization script - run once during deployment to set up
Catalyst Data Store tables and seed initial data.

Usage:
    python catalyst_init.py

This script connects to the Catalyst Data Store (MySQL) and:
1. Creates all tables defined in app.models
2. Seeds reference data (states, districts, crime heads, etc.)
3. Seeds sample crime data via the DataSeeder
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, async_session_factory
from app.models.base import Base
import app.models.reference
import app.models.geography
import app.models.personnel
import app.models.case_master
import app.models.complainant
import app.models.victim
import app.models.accused
import app.models.arrest_surrender
import app.models.act_section
import app.models.analytics
import app.models.user


async def init_database():
    print("Creating all tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully.")

    print("Seeding data...")
    from app.seeders.data_seeder import DataSeeder
    async with async_session_factory() as session:
        seeder = DataSeeder(session)
        await seeder.seed_all()
    print("Data seeded successfully.")


if __name__ == "__main__":
    asyncio.run(init_database())
