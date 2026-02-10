import os
import asyncio
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models import Product
from dotenv import load_dotenv

load_dotenv()

async def check_stats():
    url = os.getenv("DATABASE_URL")
    if not url or not url.startswith("postgresql"):
        print("Error: DATABASE_URL must be a Supabase Postgres URL.")
        return

    engine = create_async_engine(url)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Total Products
        total_res = await session.execute(select(func.count(Product.id)))
        total = total_res.scalar()

        # Products with Embeddings
        embed_res = await session.execute(select(func.count(Product.id)).where(Product.embedding != None))
        with_embed = embed_res.scalar()

        print(f"📊 Supabase Stats:")
        print(f"Total Products: {total}")
        print(f"Products with Embeddings: {with_embed}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_stats())
