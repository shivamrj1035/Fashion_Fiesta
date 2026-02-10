from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import products, auth, search
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

app.include_router(products.router)
app.include_router(auth.router)
app.include_router(search.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Fashion Fiesta API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
