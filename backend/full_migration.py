import os
import asyncio
import sqlite3
import httpx
import math
from sqlmodel import Session, select, create_engine, SQLModel, func
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from database import init_db
from models import Product, Category, User
from dotenv import load_dotenv

load_dotenv()

def sanitize_value(v):
    """Recursively replaces NaN with None for JSON compatibility."""
    if isinstance(v, float) and math.isnan(v):
        return None
    if isinstance(v, dict):
        return {k: sanitize_value(val) for k, val in v.items()}
    if isinstance(v, list):
        return [sanitize_value(val) for val in v]
    return v

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TARGET_DB_URL = os.getenv("DATABASE_URL") 
LOCAL_IMAGE_DIR = r"./dataset/images"
BUCKET_NAME = "product-images"

async def upload_image(client, file_path, file_name):
    """Uploads an image to Supabase Storage."""
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{file_name}"
    headers = {
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "image/jpeg"
    }
    
    try:
        # Check if exists first (optional, but saves bandwidth)
        # For migration speed, we just try to upload; 409 means it's already there
        with open(file_path, "rb") as f:
            resp = await client.post(url, content=f.read(), headers=headers)
            if resp.status_code in [200, 201, 409]: 
                return f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{file_name}"
            else:
                return None
    except Exception:
        return None

async def migrate_data():
    if not TARGET_DB_URL or not TARGET_DB_URL.startswith("postgresql"):
        print("❌ Error: DATABASE_URL must be a Supabase Postgres URL.")
        return

    print(f"🚀 Initializing Cloud Migration...")

    # 1. Initialize Remote Schema
    remote_engine = create_async_engine(TARGET_DB_URL, echo=False)
    async with remote_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    # 2. Local Source
    local_engine = create_engine("sqlite:///./fashion_fiesta.db")
    with Session(local_engine) as local_session:
        print("Reading local data...")
        local_categories = local_session.exec(select(Category)).all()
        local_products = local_session.exec(select(Product)).all()

    # 3. Connection Setup
    async_session_factory = sessionmaker(remote_engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session_factory() as remote_session:
        # MIGRATE CATEGORIES (Skip if exists)
        print("Migrating Categories...")
        for cat in local_categories:
            res = await remote_session.execute(select(Category).where(Category.id == cat.id))
            if not res.first():
                remote_session.add(Category(id=cat.id, name=cat.name, image_url=cat.image_url))
        await remote_session.commit()
        print("✅ Categories synced.")

        # GET ALREADY MIGRATED PRODUCT IDs
        res = await remote_session.execute(select(Product.id))
        migrated_ids = set(res.scalars().all())
        print(f"Skipping {len(migrated_ids)} products already in cloud.")

        # MIGRATE PRODUCTS IN BATCHES
        to_migrate = [p for p in local_products if p.id not in migrated_ids]
        print(f"Products remaining to migrate: {len(to_migrate)}")

        async with httpx.AsyncClient(timeout=60.0) as client:
            batch_size = 20 # Parallel uploads
            for i in range(0, len(to_migrate), batch_size):
                batch = to_migrate[i:i+batch_size]
                
                # 1. Parallel Image Uploads
                async def process_product(prod):
                    new_image_urls = []
                    for url in prod.image_urls:
                        if url.startswith("/dataset/images/"):
                            img_name = url.split("/")[-1]
                            local_path = os.path.join(LOCAL_IMAGE_DIR, img_name)
                            if os.path.exists(local_path):
                                cloud_url = await upload_image(client, local_path, img_name)
                                new_image_urls.append(cloud_url if cloud_url else url)
                            else:
                                new_image_urls.append(url)
                        else:
                            new_image_urls.append(url)
                    
                    return Product(
                        id=prod.id,
                        name=prod.name,
                        description=prod.description,
                        price=prod.price,
                        old_price=prod.old_price,
                        rating=prod.rating,
                        stock=prod.stock,
                        is_featured=prod.is_featured,
                        is_popular=prod.is_popular,
                        is_new=prod.is_new,
                        image_urls=new_image_urls,
                        attributes=sanitize_value(prod.attributes),
                        embedding=sanitize_value(prod.embedding),
                        category_id=prod.category_id,
                        created_at=prod.created_at
                    )

                # Execute batch
                try:
                    remote_prods = await asyncio.gather(*[process_product(p) for p in batch])
                    for rp in remote_prods:
                        remote_session.add(rp)
                    
                    await remote_session.commit()
                    count = i + len(batch) + len(migrated_ids)
                    print(f"📦 Progress: {count}/{len(local_products)} items synced...")
                except Exception as e:
                    print(f"⚠️ Batch error around items {i} to {i+batch_size}: {e}")
                    await remote_session.rollback()
                    # Continue to next batch
                    continue

            print("✨ Migration Complete!")

if __name__ == "__main__":
    asyncio.run(migrate_data())
