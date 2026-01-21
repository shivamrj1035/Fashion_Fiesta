from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from models import Product, ProductBase, Category
from database import get_session

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[Product])
async def get_products(
    offset: int = 0,
    limit: int = Query(default=20, le=100),
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    search: Optional[str] = None,
    session: AsyncSession = Depends(get_session)
):
    query = select(Product)
    
    if search:
        query = query.where(Product.name.ilike(f"%{search}%") | Product.description.ilike(f"%{search}%"))
    if category_id:
        query = query.where(Product.category_id == category_id)
    if min_price:
        query = query.where(Product.price >= min_price)
    if max_price:
        query = query.where(Product.price <= max_price)
        
    # Ordering logic
    if order == "desc":
        query = query.order_by(getattr(Product, sort_by).desc())
    else:
        query = query.order_by(getattr(Product, sort_by).asc())
        
    query = query.offset(offset).limit(limit)
    
    results = await session.execute(query)
    return results.scalars().all()

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: int, session: AsyncSession = Depends(get_session)):
    product = await session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/categories", response_model=List[Category])
async def get_categories(session: AsyncSession = Depends(get_session)):
    results = await session.execute(select(Category))
    return results.scalars().all()
