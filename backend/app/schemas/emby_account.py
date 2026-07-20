from pydantic import BaseModel


class EmbyAccountResponse(BaseModel):
    id: int
    user_id: int
    emby_user_id: str
    emby_username: str
    active: bool

    class Config:
        from_attributes = True