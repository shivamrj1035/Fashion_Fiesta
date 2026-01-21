from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import products, auth
from database import init_db

app = FastAPI(title="Fashion Fiesta API", version="1.0.0")

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(products.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Fashion Fiesta API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
