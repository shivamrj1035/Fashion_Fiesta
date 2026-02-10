from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import products, search
from database import init_db

from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Fashion Fiesta API", version="1.0.0")

# Dataset Path - Configurable via .env
# Default points to the expected kagglehub cache location
DATASET_PATH = os.getenv(
    "DATASET_PATH", 
    r"C:\Users\Lenovo\.cache\kagglehub\datasets\paramaggarwal\fashion-product-images-dataset\versions\1\fashion-dataset"
)
DATASET_IMAGES_PATH = os.path.join(DATASET_PATH, "images")

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # More permissive for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if os.path.exists(DATASET_IMAGES_PATH):
    app.mount("/dataset/images", StaticFiles(directory=DATASET_IMAGES_PATH), name="dataset-images")

@app.on_event("startup")
async def on_startup():
    await init_db()
    
    # Sync ML Service Cache
    from database import get_session
    from models import Product
    from sqlmodel import select
    from ml_service import ml_service
    
    print("🚀 Initializing ML Cache...")
    try:
        from sqlmodel import func
        async for session in get_session():
            # Get total count first
            count_stmt = select(func.count(Product.id)).where(Product.embedding != None)
            total_count = (await session.execute(count_stmt)).scalar() or 0
            print(f"📦 Total products to cache: {total_count}")
            
            batch_size = 1000
            all_product_data = []
            
            for offset in range(0, total_count, batch_size):
                print(f"➡️ Fetching batch: {offset} to {min(offset + batch_size, total_count)}...")
                # Fetch only ID and Embedding to save bandwidth/memory
                batch_stmt = select(Product.id, Product.embedding).where(Product.embedding != None).offset(offset).limit(batch_size)
                result = await session.execute(batch_stmt)
                batch_rows = result.all()
                all_product_data.extend([{"id": r[0], "embedding": r[1]} for r in batch_rows])
            
            ml_service.sync_cache(all_product_data)
            break
    except Exception as e:
        print(f"❌ Error during ML Cache Init: {e}")
        import traceback
        traceback.print_exc()
    
    print("✨ API and ML Service ready.")

app.include_router(products.router)
app.include_router(search.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Fashion Fiesta API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
