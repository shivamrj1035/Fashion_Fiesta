
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

    # 3. Get only IDs and embeddings to save memory and time
    # This is a bit tricky with SQLModel/SQLAlchemy async, but let's fetch only necessary columns
    result = await session.execute(select(Product.id, Product.embedding).where(Product.embedding != None))
    # results is a list of Row objects (id, embedding), convert to dicts for ML service
    product_data = [{"id": r.id, "embedding": r.embedding} for r in result.all()]
    
    if not product_data:
        return []

    # 4. Find similar products (returns tuples of id, score)
    # We pass the list of objects with .id and .embedding attributes
    similar_results = ml_service.find_similar_products(query_embedding, product_data, k=24)
    
    if not similar_results:
        return []
        
    similar_ids = [r[0] for r in similar_results]
    scores_map = {r[0]: r[1] for r in similar_results}
        
    # 5. Fetch full product objects ONLY for the similar IDs
    prod_query = select(Product).where(Product.id.in_(similar_ids))
    full_prod_res = await session.execute(prod_query)
    full_products = full_prod_res.scalars().all()
    
    products_map = {p.id: p for p in full_products}
    
    recommended_products = []
    # Preserve the order from similar_results
    for pid, score in similar_results:
        if pid in products_map:
            prod = products_map[pid]
            prod_dict = prod.dict()
            prod_dict['match_score'] = score
            recommended_products.append(ProductWithScore(**prod_dict))
            
    return recommended_products
