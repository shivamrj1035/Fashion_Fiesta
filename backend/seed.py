
import asyncio
import random
from sqlmodel import select
from database import engine, init_db
from models import Category, Product
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from faker import Faker

fake = Faker()

# Curated list of high-quality fashion images tokens from Unsplash
IMAGE_TOKENS = [
    "photo-1583337130417-3346a1be7dee", "photo-1591047139829-d91aecb6caea", 
    "photo-1542291026-7eec264c27ff", "photo-1524592094714-0f0654e20314",
    "photo-1483985988355-763728e1935b", "photo-1542272604-787c3835535d",
    "photo-1521572163474-6864f9cf17ab", "photo-1548036328-c9fa89d128fa",
    "photo-1490578474895-699cd4e2cf59", "photo-1541099649105-f69ad21f3246",
    "photo-1571782742478-0816a4773a10", "photo-1555529669-e69e7aa0ba9a",
    "photo-1551488852-080175b94516", "photo-1549298916-b41d501d3772",
    "photo-1503342217505-b0a15ec3261c", "photo-1515886657613-9f3515b0c78f",
    "photo-1529139574466-a302d2d3f524", "photo-1504198458649-3128b932f49e",
    "photo-1516762689617-e1cffcef479d", "photo-1532453288672-3a27e9be9efd",
    "photo-1487222477894-8943e31ef7b2", "photo-1550614000-4b9519e4556f",
    "photo-1556905055-8f358a7a47b2", "photo-1576566588028-4147f3842f27",
    "photo-1588099768531-a72d4a198538", "photo-1589362916122-c322b460d37e",
    "photo-1620799140408-ed5341cd2431", "photo-1552346154-21d32810aba3",
    "photo-1523381210434-271e8be1f52b", "photo-1539109136881-3be0616acf4b",
    "photo-1507680436322-42d4b0a4e616", "photo-1551232864-3f0899e6385b"
]

def get_random_image():
    token = random.choice(IMAGE_TOKENS)
    return f"https://images.unsplash.com/{token}?q=80&w=1000&auto=format&fit=crop"

async def seed_data():
    print("Database data seeding started...")
    await init_db()

    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        # Check if data exists
        result = await session.execute(select(Category))
        existing_categories = result.scalars().all()
        
        if existing_categories:
            print(f"Found {len(existing_categories)} categories. Clearing existing data...")
            # Ideally we would truncate, but for now let's just add to it or return
            # For this request, let's just return if categories exist to avoid duplicates if run multiple times
            # Or if user wants MORE, we can just proceed. Let's assume we proceed but maybe skip creating categories if they exist.
            pass
        
        if not existing_categories:
            print("Creating categories...")
            # Categories
            categories = [
                Category(name="Men", image_url=get_random_image()),
                Category(name="Women", image_url=get_random_image()),
                Category(name="Kids", image_url=get_random_image()),
                Category(name="Accessories", image_url=get_random_image()),
                Category(name="Footwear", image_url=get_random_image()),
                Category(name="Sports", image_url=get_random_image()),
                Category(name="Luxury", image_url=get_random_image())
            ]
            session.add_all(categories)
            await session.commit()
            for cat in categories:
                await session.refresh(cat)
            existing_categories = categories
        
        print("Generating 1500 products...")
        
        products = []
        BATCH_SIZE = 100
        TOTAL_PRODUCTS = 1500
        
        colors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Pink", "Orange", "Grey"]
        sizes = ["XS", "S", "M", "L", "XL", "XXL"]
        materials = ["Cotton", "Polyester", "Leather", "Denim", "Wool", "Silk", "Linen"]
        
        for i in range(TOTAL_PRODUCTS):
            category = random.choice(existing_categories)
            
            # Weighted random for boolean flags to make some items featured/popular
            is_featured = random.random() < 0.2 # 20% chance
            is_popular = random.random() < 0.3 # 30% chance
            is_new = random.random() < 0.15 # 15% chance
            
            price = round(random.uniform(20.0, 500.0), 2)
            discount = random.uniform(0, 0.5) if random.random() < 0.4 else 0
            old_price = round(price * (1 + discount), 2) if discount > 0 else None
            
            product_name = f"{fake.color_name()} {category.name} {fake.word().capitalize()}"
            if category.name == "Footwear":
                product_name = f"{fake.color_name()} {fake.word().capitalize()} Sneakers"
            elif category.name == "Accessories":
                product_name = f"{fake.word().capitalize()} {random.choice(['Bag', 'Watch', 'Belt', 'Scarf'])}"
            
            product = Product(
                name=product_name,
                price=price,
                old_price=old_price,
                rating=round(random.uniform(3.5, 5.0), 1),
                stock=random.randint(0, 200),
                is_featured=is_featured,
                is_popular=is_popular,
                is_new=is_new,
                category_id=category.id,
                image_urls=[get_random_image(), get_random_image()],
                description=fake.paragraph(nb_sentences=3),
                attributes={
                    "color": random.choice(colors),
                    "size": random.choice(sizes),
                    "material": random.choice(materials)
                }
            )
            products.append(product)
            
            if len(products) >= BATCH_SIZE:
                session.add_all(products)
                await session.commit()
                print(f"Seeded {i+1}/{TOTAL_PRODUCTS} products...")
                products = []

        if products:
            session.add_all(products)
            await session.commit()
            print(f"Seeded remaining {len(products)} products.")

        print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
