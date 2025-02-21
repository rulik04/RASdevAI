import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request, Body
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import jwt
from jose.exceptions import JWTError
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, Token, PasswordChange, RefreshTokenRequest
from app.services import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    send_verification_email,
    create_verification_token,
    SECRET_KEY,
    VERIFICATION_SECRET_KEY,
    ALGORITHM
)
from app.oauth import oauth
from fastapi import Query


router = APIRouter()

# ---------------------
# Regular Registration
# ---------------------
@router.post("/register", response_model=Token)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd,
        auth_provider="local",
        email_verified=False
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    token_data = {"user_id": new_user.id}
    verification_token = create_verification_token(token_data)
    verification_link = f"http://localhost:8000/auth/verify-email?token={verification_token}"
    send_verification_email(new_user.email, verification_link)
    
    access_token = create_access_token({"sub": new_user.email})
    refresh_token = create_refresh_token({"sub": new_user.email})
    return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")

@router.get("/verify-email")
async def verify_email(token: str = Query(...), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, VERIFICATION_SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=400, detail="Invalid verification token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.email_verified = True
    await db.commit()
    return {"message": "Email verified successfully"}

# ---------------------
# Regular Login
# ---------------------
@router.post("/login", response_model=Token)
async def login(form_data: dict = Body(...), db: AsyncSession = Depends(get_db)):
    email = form_data.get("email")
    password = form_data.get("password")
    if not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email and password required")
    
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if not user or not user.hashed_password or not verify_password(password, user.hashed_password):
        print("Invalid credentials")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.email_verified:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email not verified")
    
    access_token = create_access_token({"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})
    return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer", user=user)

# ---------------------
# Refresh Token Endpoint
# ---------------------
@router.post("/refresh", response_model=Token)
async def refresh_token(payload: RefreshTokenRequest):
    try:
        token_data = jwt.decode(payload.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if token_data.get("token_type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        email = token_data.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    new_access_token = create_access_token({"sub": email})
    new_refresh_token = create_refresh_token({"sub": email})
    return Token(access_token=new_access_token, refresh_token=new_refresh_token, token_type="bearer")

# ---------------------
# Change Password Endpoint
# ---------------------
@router.post("/change-password")
async def change_password(data: PasswordChange, db: AsyncSession = Depends(get_db), request: Request = None):
    email = request.headers.get("X-User-Email")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated")
    
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if not user or not user.hashed_password or not verify_password(data.old_password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Old password is incorrect")
    
    user.hashed_password = get_password_hash(data.new_password)
    await db.commit()
    return {"message": "Password changed successfully"}

# ---------------------
# Google OAuth Endpoints
# ---------------------
@router.get("/login/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri, access_type="offline", prompt="consent")

@router.get("/google", name="google_callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        if "id_token" in token:
            user_info = await oauth.google.parse_id_token(request, token)
        else:
            user_info = await oauth.google.userinfo(token=token)
    except Exception as e:
        logging.error(f"Error during Google OAuth callback: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"OAuth error: {e}")
    
    email = user_info.get("email")
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No email provided by Google")
    
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if not user:
        user = User(
            username=user_info.get("name") or email.split("@")[0],
            email=email,
            hashed_password=None,  
            auth_provider="google",
            email_verified=True,
            social_id=user_info.get("sub"),
            profile_pic=user_info.get("picture")
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    access_token = create_access_token({"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})
    return JSONResponse({
        "message": "Google login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_info": user_info
    })
