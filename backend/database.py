from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os

# For development, we use SQLite. For production, we use Supabase PostgreSQL.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./fashion_fiesta.db")

# Use a different engine configuration for Postgres vs SQLite
if DATABASE_URL.startswith("postgresql"):
    # Asyncpg is preferred for PostgreSQL with SQLModel/SQLAlchemy
    engine = create_async_engine(DATABASE_URL, echo=False, future=True)
else:
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
