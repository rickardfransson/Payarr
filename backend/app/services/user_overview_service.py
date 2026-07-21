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