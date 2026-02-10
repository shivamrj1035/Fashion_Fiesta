import os
import httpx
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from database import get_session
from models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Clerk Configuration
CLERK_ISSUER = os.getenv("CLERK_ISSUER") # e.g., https://clerk.your-domain.com
CLERK_JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"

async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 1. Fetch JWKS from Clerk (In production, cache this!)
        async with httpx.AsyncClient() as client:
            response = await client.get(CLERK_JWKS_URL)
            jwks = response.json()
            
        # 2. Decode and verify the token
        payload = jwt.decode(
            token, 
            jwks, 
            algorithms=["RS256"], 
            issuer=CLERK_ISSUER,
            options={"verify_aud": False} # Adjust if you set audience in Clerk
        )
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
    except (JWTError, httpx.HTTPError, Exception) as e:
        print(f"Auth Error: {e}")
        raise credentials_exception
    
    # 3. Check if user exists in our local DB, if not, create "shorthand" profile
    user = await session.get(User, user_id)
    if not user:
        # Extract name and email from payload if available
        # Note: These claims depend on your Clerk JWT template configuration
        new_user = User(
            id=user_id,
            email=payload.get("email", ""),
            full_name=payload.get("name", "New User")
        )
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        user = new_user
        
    return user
