from pydantic import BaseModel
from typing import Optional


class EmbyUser(BaseModel):
    id: str
    name: str
    enabled: bool
    last_login: Optional[str] = None