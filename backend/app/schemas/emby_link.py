from pydantic import BaseModel


class EmbyAccountLink(BaseModel):
    user_id: int
    emby_user_id: str
    emby_username: str