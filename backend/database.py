from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os

# Environment Switch Configuration
USE_CLOUD_DB = os.getenv("USE_CLOUD_DB", "false").lower() == "true"
LOCAL_URL = "sqlite+aiosqlite:///./fashion_fiesta.db"
CLOUD_URL = os.getenv("DATABASE_URL") # This should be the postgres+asyncpg URL

if USE_CLOUD_DB and CLOUD_URL:
    print("🌐 Connecting to Cloud Database (Supabase)...")
    DATABASE_URL = CLOUD_URL
    engine = create_async_engine(DATABASE_URL, echo=False, future=True)
else:
    print("🏠 Connecting to Local Database (SQLite)...")
    DATABASE_URL = LOCAL_URL
    engine = create_async_engine(DATABASE_URL, echo=True, future=True)

async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(SQLModel.metadata.drop_all) # Dangerous for production!
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session() -> AsyncSession:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
