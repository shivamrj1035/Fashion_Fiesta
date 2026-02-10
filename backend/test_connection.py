import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import select, func
from database import engine
from models import Product

async def test():
    print(f"Testing connection with engine: {engine.url}")
    try:
        async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        async with async_session() as session:
            print("Executing count query...")
            res = await session.execute(select(func.count(Product.id)))
            count = res.scalar()
            print(f"Count: {count}")
            
            print("Executing data query (first 5)...")
            res = await session.execute(select(Product.id, Product.embedding).limit(5))
            rows = res.all()
            for r in rows:
                print(f"Product {r.id}: embedding length {len(r.embedding) if r.embedding else 'None'}")
                
        print("✅ Connection and data retrieval successful!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
