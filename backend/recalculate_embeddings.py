import asyncio
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from database import engine
from models import Product
from ml_service import ml_service
import sys

# Windows selector event loop policy fix
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def recalculate_embeddings():
    print("Starting embedding recalculation...")
    
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # Fetch all products
        result = await session.execute(select(Product))
        products = result.scalars().all()
        print(f"Found {len(products)} products.")
        
        # Cache for embeddings by URL to avoid redundant processing/requests
        url_embedding_cache = {}
        
        updated_count = 0
        error_count = 0
        
        for i, product in enumerate(products):
            if not product.image_urls:
                continue
                
            image_url = product.image_urls[0]
            
            # Check cache first
            if image_url in url_embedding_cache:
                embedding = url_embedding_cache[image_url]
            else:
                print(f"Processing unique image: {image_url}")
                # Generate embedding (using new CV2 logic)
                embedding = ml_service.extract_features_from_url(image_url)
                if embedding:
                    url_embedding_cache[image_url] = embedding
                else:
                    print(f"Failed to generate embedding for {image_url}")
                    error_count += 1
                    continue
            
            # Update product embedding
            if embedding:
                # Assign directly; SQLModel/SQLAlchemy handles List[float] -> JSON via sa_column
                product.embedding = embedding
                session.add(product)
                updated_count += 1
            
            # periodic commit or print
            if (i + 1) % 50 == 0:
                print(f"Processed {i + 1}/{len(products)} products...")
                await session.commit()
        
        await session.commit()
        print(f"Finished. Updated {updated_count} products. Errors: {error_count}.")

if __name__ == "__main__":
    asyncio.run(recalculate_embeddings())
