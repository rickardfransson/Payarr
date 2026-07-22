from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.models.payment import Payment


router = APIRouter(
    prefix="/api/v1/account",
    tags=["Account"],
)


@router.get("/{user_id}")
def get_account(
    user_id: int,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )


    if not user:
        return {
            "error": "User not found"
        }


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