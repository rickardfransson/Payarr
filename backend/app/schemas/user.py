from datetime import datetime

from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    username: str
    password_hash: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    role: str
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True