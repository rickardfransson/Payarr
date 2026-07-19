from datetime import datetime

from pydantic import BaseModel


class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    emby_user_id: str | None
    start_date: datetime
    end_date: datetime
    active: bool
    auto_renew: bool

    model_config = {
        "from_attributes": True
    }