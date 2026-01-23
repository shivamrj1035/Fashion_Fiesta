
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import Product, ProductBase
from database import get_session
from ml_service import ml_service

router = APIRouter(prefix="/search", tags=["search"])


class ProductWithScore(ProductBase):
    id: int
    category_id: int
    match_score: float

@router.post("/image", response_model=List[ProductWithScore])
async def search_by_image(file: UploadFile = File(...), session: AsyncSession = Depends(get_session)):
    # 1. Read the image file
    contents = await file.read()
    
    # 2. Extract features
    query_embedding = ml_service.extract_features_from_bytes(contents)
    
    if not query_embedding:
        raise HTTPException(status_code=400, detail="Could not process image")

    # 3. Get all products with embeddings
    result = await session.execute(select(Product))
    products = result.scalars().all()
    
    # 4. Find similar products (returns tuples of id, score)
    similar_results = ml_service.find_similar_products(query_embedding, products, k=10)
    
    if not similar_results:
        return []
        
    similar_ids = [r[0] for r in similar_results]
    scores_map = {r[0]: r[1] for r in similar_results}
        
    # 5. Return the full product objects in the correct order
    products_map = {p.id: p for p in products if p.id in similar_ids}
    
    recommended_products = []
    for pid, score in similar_results:
        if pid in products_map:
            prod = products_map[pid]
            # Create a response object combining product data and score
            # doing this carefully to compatible with SQLModel
            prod_dict = prod.dict()
            prod_dict['match_score'] = score
            recommended_products.append(ProductWithScore(**prod_dict))
            
    return recommended_products
