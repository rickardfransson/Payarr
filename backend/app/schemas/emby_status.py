from pydantic import BaseModel


class EmbyStatusResponse(BaseModel):
    user_id: int
    emby_user_id: str
    emby_username: str
    emby_account_active: bool
    subscription_active: bool