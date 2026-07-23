from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.subscription import Subscription
from app.models.emby_account import EmbyAccount



class EmbySubscriptionService:


    @staticmethod
    def activate_subscription(
        db: Session,
        user_id: int,
        days: int = 30,
    ):


        user = (
            db.query(User)
            .filter(
                User.id == user_id
            )
            .first()
        )


        if not user:
            raise Exception(
                "User not found"
            )


        if not user.emby_account:
            raise Exception(
                "User has no Emby account"
            )



        if user.subscription:

            subscription = user.subscription

            subscription.active = True

            subscription.end_date = (
                datetime.utcnow()
                +
                timedelta(days=days)
            )


        else:

            subscription = Subscription(
                user_id=user.id,
                start_date=datetime.utcnow(),
                end_date=(
                    datetime.utcnow()
                    +
                    timedelta(days=days)
                ),
                active=True,
                auto_renew=False,
            )

            db.add(subscription)



        user.emby_account.status = "active"


        db.commit()

        db.refresh(user)


        return {

            "success": True,

            "user_id": user.id,

            "username": user.username,

            "subscription_active": True,

            "emby_status":
                user.emby_account.status,

            "expires":
                subscription.end_date,

        }