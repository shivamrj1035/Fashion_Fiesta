
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import Product
from database import get_session
from ml_service import ml_service

router = APIRouter(prefix="/search", tags=["search"])

@router.post("/image", response_model=List[Product])
async def search_by_image(file: UploadFile = File(...), session: AsyncSession = Depends(get_session)):
    # 1. Read the image file
    contents = await file.read()
    
    # 2. Extract features
    query_embedding = ml_service.extract_features_from_bytes(contents)
    
    if not query_embedding:
        raise HTTPException(status_code=400, detail="Could not process image")

    # 3. Get all products with embeddings
    # Note: In a production vector DB, we would query the index. 
    # Here we load all (or cache them in ml_service) for simplicity given 1500 items.
    # To avoid fetching all data, we can select just ID and embedding.
    
    result = await session.execute(select(Product))
    products = result.scalars().all()
    
    # 4. Find similar products
    similar_ids = ml_service.find_similar_products(query_embedding, products, k=10)
    
    if not similar_ids:
        return []
        
    # 5. Return the full product objects in the correct order
    # fetching again to ensure full data or just filtering the list we already have
    recommended_products = [p for p in products if p.id in similar_ids]
    
    # Sort them by the order returned by find_similar_products
    recommended_products.sort(key=lambda p: similar_ids.index(p.id))
    
    return recommended_products
