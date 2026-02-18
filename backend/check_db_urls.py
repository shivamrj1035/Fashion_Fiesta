import asyncio
import os
from sqlmodel import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models import Product
from dotenv import load_dotenv

load_dotenv()

async def check():
    url = os.getenv("DATABASE_URL")
    engine = create_async_engine(url)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        result = await session.execute(select(Product).limit(5))
        prods = result.scalars().all()
        for p in prods:
            print(f"ID: {p.id}, URLs: {p.image_urls}")

if __name__ == "__main__":
    asyncio.run(check())
