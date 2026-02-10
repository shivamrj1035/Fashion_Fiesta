from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Environment Switch Configuration
USE_CLOUD_DB = os.getenv("USE_CLOUD_DB", "local")
LOCAL_URL = "sqlite+aiosqlite:///./fashion_fiesta.db"
CLOUD_URL = os.getenv("DATABASE_URL") # This should be the postgres+asyncpg URL
print(USE_CLOUD_DB)
print(CLOUD_URL)
if USE_CLOUD_DB == "cloud" and CLOUD_URL:
    print("🌐 Connecting to Cloud Database (Supabase)...")
    DATABASE_URL = CLOUD_URL
    # Optimized for Supabase Connection Pooler (Transaction Mode)
    engine = create_async_engine(
        DATABASE_URL, 
        echo=False, 
        future=True,
        pool_size=5, # Reduced for pooler friendliness
        max_overflow=10,
        pool_recycle=300,
        pool_pre_ping=True,
        connect_args={
            "command_timeout": 60,
            "statement_cache_size": 0, # CRITICAL: Disable for Supabase Transaction Pooler
            "prepared_statement_cache_size": 0, # Double check for some asyncpg versions
            "server_settings": {
                "jit": "off",
            }
        }
    )
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
