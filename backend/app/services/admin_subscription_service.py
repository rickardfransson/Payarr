from datetime import datetime, time

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.subscription import Subscription


class AdminSubscriptionService:


    @staticmethod
    def activate(
        db: Session,
        user: User,
        end_date,
    ):

        now = datetime.utcnow()

        end_datetime = datetime.combine(
            end_date,
            time.max
        )


        if user.subscription is None:

            subscription = Subscription(
                user_id=user.id,
                start_date=now,
                end_date=end_datetime,
                active=True,
                auto_renew=False,
            )

            db.add(subscription)


        else:

            user.subscription.active = True
            user.subscription.end_date = end_datetime


        if user.emby_account:

            user.emby_account.status = "active"


        db.commit()

        db.refresh(user)


        return {
            "success": True,
            "user_id": user.id,
            "username": user.username,
            "subscription_active": True,
            "subscription_end": (
                user.subscription.end_date
                if user.subscription
                else None
            ),
            "emby_status": (
                user.emby_account.status
                if user.emby_account
                else None
            )
        }