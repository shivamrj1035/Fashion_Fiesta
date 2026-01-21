
import asyncio
from sqlalchemy import text
from database import engine

async def optimize_database():
    print("optimizing database...")
    async with engine.begin() as conn:
        # 1. Add Indices if they don't exist (SQLite doesn't support 'IF NOT EXISTS' for indexes in all versions, but we'll try)
        # We use raw SQL because SQLModel doesn't auto-migrate existing tables easily without Alembic
        
        print("Creating indexes...")
        try:
            await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_product_category_id ON product (category_id)"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_product_created_at ON product (created_at)"))
            print("Indexes created.")
        except Exception as e:
            print(f"Index creation warning (might already exist): {e}")

        # 2. Optimize Image URLs (Resize huge 1000px images to 400px for card view)
        print("Optimizing image URLs...")
        # valid Unsplash Size: q=80&w=1000 -> q=80&w=400
        # We need to do this carefully. SQLite doesn't have great string replace functions in all versions.
        # So we will fetch, modify in python, and update.
        
    async with engine.begin() as conn:
        # Fetch all products with large images
        # We'll just update ALL for simplicity to ensure consistency
        pass # doing it in session below

    from sqlalchemy.orm import sessionmaker
    from sqlalchemy.ext.asyncio import AsyncSession
    from models import Product
    from sqlmodel import select

    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        result = await session.execute(select(Product))
        products = result.scalars().all()
        
        updated_count = 0
        for p in products:
            new_urls = []
            changed = False
            for url in p.image_urls:
                if "w=1000" in url:
                    new_urls.append(url.replace("w=1000", "w=400"))
                    changed = True
                elif "images.unsplash.com" in url and "w=" not in url:
                     new_urls.append(url + "&w=400")
                     changed = True
                else:
                    new_urls.append(url)
            
            if changed:
                p.image_urls = new_urls
                session.add(p)
                updated_count += 1
                
        await session.commit()
        print(f"Optimized images for {updated_count} products.")

if __name__ == "__main__":
    asyncio.run(optimize_database())
