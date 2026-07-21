from pydantic import BaseModel


class EmbyUserStatusResponse(BaseModel):
    user_id: int
    username: str
    emby_username: str
    subscription_active: bool
    emby_active: bool