from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os

# For development, we can use SQLite. For "Amazon-scale", we'll use PostgreSQL.
# DATABASE_URL = "postgresql+asyncpg://user:password@localhost/fashion_fiesta"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./fashion_fiesta.db")

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
