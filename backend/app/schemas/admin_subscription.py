from datetime import date

from pydantic import BaseModel


class SubscriptionActivateRequest(BaseModel):

    end_date: date