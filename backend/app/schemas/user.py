from pydantic import BaseModel, EmailStr
import uuid
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str | None = None

class UserResponse(UserBase):
    id: uuid.UUID
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
