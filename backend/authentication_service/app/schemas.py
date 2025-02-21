from pydantic import BaseModel, EmailStr, constr

class UserCreate(BaseModel):
    username: constr(strip_whitespace=True, min_length=3)
    email: EmailStr
    password: constr(min_length=8)

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    auth_provider: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: UserOut

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str
