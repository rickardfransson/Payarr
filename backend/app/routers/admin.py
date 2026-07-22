from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_database
from app.models.user import User
from app.models.payment import Payment
from app.core.dependencies import get_current_admin


router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin"]
)


@router.get("/test")
def admin_test(
    current_user: User = Depends(get_current_admin)
):
    return {
        "message": "Welcome Admin",
        "username": current_user.username,
        "role": current_user.role
    }



@router.get("/users")
def get_users(
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin)
):

    users = (
        db.query(User)
        .all()
    )


    result = []


    for user in users:

        last_payment = (
            db.query(Payment)
            .filter(
                Payment.user_id == user.id
            )
            .order_by(
                Payment.created_at.desc()
            )
            .first()
        )


        result.append(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "active": user.active,

                "subscription": (
                    {
                        "active": user.subscription.active,
                        "end_date": user.subscription.end_date,
                    }
                    if user.subscription
                    else None
                ),

                "emby": (
                    {
                        "username": user.emby_account.emby_username,
                    }
                    if user.emby_account
                    else None
                ),

                "last_payment": (
                    {
                        "amount": last_payment.amount,
                        "status": last_payment.status,
                        "paid_at": last_payment.paid_at,
                    }
                    if last_payment
                    else None
                ),
            }
        )


    return result