from datetime import datetime

from pydantic import BaseModel


class EmbySyncStatusResponse(BaseModel):
    scheduler_running: bool
    last_sync: datetime | None = None
    last_status: str | None = None
    users_checked: int
    users_updated: int
    users_disabled: int
    next_sync: datetime | None = None