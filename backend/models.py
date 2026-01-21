from datetime import datetime
from typing import Optional, List, Dict
from sqlmodel import SQLModel, Field, Relationship, JSON, Column
from pydantic import EmailStr

class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True)
    full_name: str
    is_active: bool = True
    is_superuser: bool = False

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CategoryBase(SQLModel):
    name: str = Field(index=True)
    image_url: str

class Category(CategoryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    products: List["Product"] = Relationship(back_populates="category")

class ProductBase(SQLModel):
    name: str = Field(index=True)
    description: str
    price: float = Field(index=True)
    old_price: Optional[float] = None
    rating: float = Field(default=0, index=True)
    stock: int = Field(default=0)
    is_featured: bool = Field(default=False, index=True)
    is_popular: bool = Field(default=False, index=True)
    is_new: bool = Field(default=False, index=True)
    image_urls: List[str] = Field(default=[], sa_column=Column(JSON))
    attributes: Dict = Field(default={}, sa_column=Column(JSON)) # For Amazon-like flexibility

class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="category.id", index=True)
    category: Category = Relationship(back_populates="products")
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

class CartItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    product_id: int = Field(foreign_key="product.id")
    quantity: int = Field(default=1)

class WishlistItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    product_id: int = Field(foreign_key="product.id")
