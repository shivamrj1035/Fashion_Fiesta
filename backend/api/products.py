from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from models import Product, ProductBase, Category, CategoryBase
from database import get_session
from ml_service import ml_service

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[Product])
async def get_products(
    offset: int = 0,
    limit: int = Query(default=20, le=100),
    category_id: Optional[int] = None,
    gender: Optional[str] = None,
    sub_category: Optional[str] = None,
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
    
    # Modern JSON attribute filtering for SQLite/Generic JSON
    if gender:
        # Case-insensitive filtering using json_extract and lower
        query = query.where(func.lower(func.json_extract(Product.attributes, "$.gender")) == gender.lower())
    if sub_category:
        query = query.where(func.lower(func.json_extract(Product.attributes, "$.articleType")) == sub_category.lower())

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


@router.get("/featured", response_model=List[Product])
async def get_featured_products(
    limit: int = Query(default=8, le=20),
    session: AsyncSession = Depends(get_session)
):
    # Try to get explicitly marked featured products first
    query = select(Product).where(Product.is_featured == True).limit(limit)
    results = await session.execute(query)
    products = results.scalars().all()
    
    # If not enough, fill with random products
    if len(products) < limit:
        remaining = limit - len(products)
        # Using func.random() for SQLite
        query_rand = select(Product).order_by(func.random()).limit(remaining)
        rand_results = await session.execute(query_rand)
        products.extend(rand_results.scalars().all())
        
    return products

@router.get("/popular", response_model=List[Product])
async def get_popular_products(
    limit: int = Query(default=8, le=20),
    session: AsyncSession = Depends(get_session)
):
    # Try to get explicitly marked popular products
    query = select(Product).where(Product.is_popular == True).limit(limit)
    results = await session.execute(query)
    products = results.scalars().all()
    
    if len(products) < limit:
        remaining = limit - len(products)
        query_rand = select(Product).order_by(func.random()).limit(remaining)
        rand_results = await session.execute(query_rand)
        products.extend(rand_results.scalars().all())
        
    return products

@router.get("/new-arrivals", response_model=List[Product])
async def get_new_products(
    limit: int = Query(default=8, le=20),
    session: AsyncSession = Depends(get_session)
):
    query = select(Product).order_by(Product.created_at.desc()).limit(limit)
    results = await session.execute(query)
    return results.scalars().all()


class CategoryRead(CategoryBase):
    id: int

@router.get("/categories", response_model=List[CategoryRead])
async def get_categories(session: AsyncSession = Depends(get_session)):
    results = await session.execute(select(Category))
    categories = results.scalars().all()
    
    # Process categories to add a cover image if missing
    processed_categories = []
    for cat in categories:
        cat_data = cat.dict()
        if not cat_data.get("image_url"):
            # Get first product image from this category
            prod_query = select(Product).where(Product.category_id == cat.id).limit(1)
            prod_res = await session.execute(prod_query)
            prod = prod_res.scalar_one_or_none()
            if prod and prod.image_urls:
                cat_data["image_url"] = prod.image_urls[0]
        processed_categories.append(cat_data)
        
    return processed_categories

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: int, session: AsyncSession = Depends(get_session)):
    product = await session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/{product_id}/recommendations", response_model=List[Product])
async def get_product_recommendations(
    product_id: int, 
    limit: int = Query(default=6, le=20),
    session: AsyncSession = Depends(get_session)
):
    # 1. Get the source product
    product = await session.get(Product, product_id)
    if not product or not product.embedding:
        # Fallback to random products if no embedding or product not found
        query_rand = select(Product).where(Product.id != product_id).order_by(func.random()).limit(limit)
        results = await session.execute(query_rand)
        return results.scalars().all()

    # 2. Find similar products using ML service
    # We use the in-memory cache populated on startup (sub-second performance)
    similar_results = ml_service. find_similar_products(product.embedding, products_data=None, k=limit + 1)
    
    # 3. Filter out the current product and fetch full objects
    similar_ids = [res[0] for res in similar_results if res[0] != product_id][:limit]
    
    if not similar_ids:
        return []

    prod_query = select(Product).where(Product.id.in_(similar_ids))
    full_prod_res = await session.execute(prod_query)
    full_products = full_prod_res.scalars().all()
    
    # Preserve order of similarity
    products_map = {p.id: p for p in full_products}
    recommended_products = []
    
    for sid, score in similar_results:
        if sid in products_map:
            recommended_products.append(products_map[sid])

    return recommended_products
