from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_database
from app.core.dependencies import get_current_admin
from app.models.user import User
from app.models.setting import Setting


router = APIRouter(
    prefix="/api/v1/admin/settings",
    tags=["Admin - Settings"],
)


class SubscriptionPriceRequest(BaseModel):
    price: float


@router.get("/")
def get_settings(
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin),
):

    setting = (
        db.query(Setting)
        .filter(
            Setting.key == "subscription_price"
        )
        .first()
    )

    return {
        "subscription_price": (
            float(setting.value)
            if setting
            else 100
        )
    }


@router.post("/subscription-price")
def update_subscription_price(
    data: SubscriptionPriceRequest,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin),
):

    setting = (
        db.query(Setting)
        .filter(
            Setting.key == "subscription_price"
        )
        .first()
    )

    if not setting:
        raise HTTPException(
            status_code=404,
            detail="Setting not found",
        )

    setting.value = str(data.price)

    db.commit()

    return {
        "success": True,
        "subscription_price": data.price,
    }