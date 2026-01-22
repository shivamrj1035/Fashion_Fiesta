
import asyncio
from sqlalchemy import text
from database import engine

async def migrate():
    print("Migrating database...")
    async with engine.begin() as conn:
        try:
            # Check if column exists strictly speaking is hard in generic SQL, 
            # but we can just try to add it and ignore error if it exists or use PRAGMA
            # simpler: try add
            await conn.execute(text("ALTER TABLE product ADD COLUMN embedding JSON"))
            print("Added embedding column.")
        except Exception as e:
            print(f"Migration failed (maybe column exists?): {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
