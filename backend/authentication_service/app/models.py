from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    
    username = Column(String, unique=True, index=True, nullable=False)
    
    email = Column(String, unique=True, index=True, nullable=False)
    
    hashed_password = Column(String, nullable=True)
    
    auth_provider = Column(String, nullable=False, default="local")
    
    is_active = Column(Boolean, default=True)
    
    email_verified = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    social_id = Column(String, unique=True, index=True, nullable=True)
    
    profile_pic = Column(String, nullable=True)


