from sqlalchemy.orm import Session

from app.models.user import User
from app.models.payment import Payment


class UserOverviewService:


    @staticmethod
    def get_user_overview(
        db: Session,
        user_id: int,
    ):

        user = (
            db.query(User)
            .filter(
                User.id == user_id
            )
            .first()
        )

        if not user:
            return None


        payment = (
            db.query(Payment)
            .filter(
                Payment.user_id == user_id
            )
            .order_by(
                Payment.created_at.desc()
            )
            .first()
        )


        is_admin = user.role == "admin"


        return {
            "user_id": user.id,

            "username": user.username,

            "role": user.role,
            
            "is_admin": user.role == "admin",


            "emby_access": {
                "enabled": True,
                "unlimited": is_admin,
            },


            "subscription": (
                {
                    "active": True,
                    "end_date": None,
                    "unlimited": True,
                }
                if user.role == "admin"
                else (
                    {
                        "active": user.subscription.active,
                        "end_date": user.subscription.end_date,
                        "unlimited": False,
                    }
                    if user.subscription
                    else None
                )
            ),


            "last_payment": (
                {
                    "amount": payment.amount,
                    "status": payment.status,
                    "provider": payment.provider,
                    "paid_at": payment.paid_at,
                }
                if payment
                else None
            ),


            "emby": (
                {
                    "username": user.emby_account.emby_username,
                    "active": True,
                }
                if user.emby_account
                else None
            ),
        }