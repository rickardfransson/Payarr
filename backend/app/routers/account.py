from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.session import get_database

from app.models.user import User
from app.models.payment import Payment

from app.core.dependencies import get_current_user

from app.core.security import (
    verify_password,
    hash_password,
)


router = APIRouter(
    prefix="/api/v1/account",
    tags=["Account"],
)


class ChangePasswordRequest(BaseModel):

    current_password: str
    new_password: str



@router.get("/me")
def get_account(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_database),
):

    payments = (
        db.query(Payment)
        .filter(
            Payment.user_id == user.id
        )
        .order_by(
            Payment.created_at.desc()
        )
        .all()
    )


    return {
        "user_id": user.id,
        "username": user.username,

        "subscription": (
            {
                "active": user.subscription.active,
                "end_date": user.subscription.end_date,
            }
            if user.subscription
            else None
        ),

        "payments": [
            {
                "id": payment.id,
                "amount": payment.amount,
                "currency": payment.currency,
                "status": payment.status,
                "provider": payment.provider,
                "paid_at": payment.paid_at,
                "created_at": payment.created_at,
            }
            for payment in payments
        ],

        "emby": (
            {
                "username": user.emby_account.emby_username,
                "active": True,
            }
            if user.emby_account
            else None
        ),
    }



@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_database),
):

    if not verify_password(
        data.current_password,
        user.password_hash
    ):

        return {
            "success": False,
            "message": "Felaktigt nuvarande lösenord"
        }


    user.password_hash = hash_password(
        data.new_password
    )


    db.commit()


    return {
        "success": True,
        "message": "Lösenord uppdaterat"
    }