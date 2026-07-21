from datetime import datetime

from pydantic import BaseModel


class EmbyLogResponse(BaseModel):
    id: int
    user_id: int
    emby_user_id: str
    action: str
    status: str
    message: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True