from datetime import datetime

from pydantic import BaseModel


class PaymentOverview(BaseModel):

    amount: float
    status: str
    provider: str
    paid_at: datetime | None = None



class SubscriptionOverview(BaseModel):
    active: bool
    end_date: datetime | None = None
    unlimited: bool = False



class EmbyOverview(BaseModel):

    username: str
    active: bool



class UserOverviewResponse(BaseModel):

    user_id: int
    username: str

    subscription: SubscriptionOverview | None

    last_payment: PaymentOverview | None

    emby: EmbyOverview | None
    role: str
    is_admin: bool