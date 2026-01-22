
import asyncio
import sys
import os

# Add current directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlmodel import select
from database import engine, init_db
from models import Product
from ml_service import ml_service

async def seed_embeddings():
    print("Starting embedding seeding...")
    await init_db()
    
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # Fetch all products
        result = await session.execute(select(Product))
        products = result.scalars().all()
        
        print(f"Found {len(products)} products. Checking for missing embeddings...")
        
        updated_count = 0
        failed_count = 0
        
        # Process in chunks to avoid memory issues and frequent commits
        for i, product in enumerate(products):
            if product.embedding:
                continue
                
            if not product.image_urls:
                print(f"Skipping product {product.id} (no images)")
                continue
                
            image_url = product.image_urls[0]
            print(f"Processing {i+1}/{len(products)}: {product.name}...")
            
            try:
                embedding = ml_service.extract_features_from_url(image_url)
                if embedding:
                    product.embedding = embedding
                    session.add(product)
                    updated_count += 1
                else:
                    print(f"Failed to extract features for {product.name}")
                    failed_count += 1
            except Exception as e:
                print(f"Error processing {product.name}: {e}")
                failed_count += 1
            
            # Commit every 10 updates
            if updated_count > 0 and updated_count % 10 == 0:
                await session.commit()
                print(f"Committed {updated_count} updates...")

        if updated_count % 10 != 0:
            await session.commit()
            
        print(f"Finished! Updated {updated_count} products. Failed {failed_count}.")

if __name__ == "__main__":
    # Ensure dependencies are installed before running
    try:
        import tensorflow
        import requests
        import PIL
        asyncio.run(seed_embeddings())
    except ImportError as e:
        print(f"Missing dependency: {e}. Please run 'pip install -r requirements.txt'")
