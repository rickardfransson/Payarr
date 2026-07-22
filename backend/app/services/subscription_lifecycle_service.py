from datetime import datetime

from sqlalchemy.orm import Session

from app.models.subscription import Subscription
from app.models.emby_sync_log import EmbySyncLog
from app.repositories.emby_sync_log import create_sync_log


class SubscriptionLifecycleService:


    @staticmethod
    def process_expired_subscriptions(
        db: Session,
    ):

        now = datetime.utcnow()

        expired = (
            db.query(Subscription)
            .filter(
                Subscription.active == True,
                Subscription.end_date < now,
            )
            .all()
        )


        processed = 0


        for subscription in expired:

            subscription.active = False

            user = subscription.user


            if user and user.emby_account:

                existing = (
                    db.query(EmbySyncLog)
                    .filter(
                        EmbySyncLog.user_id == user.id,
                        EmbySyncLog.action == "disable",
                        EmbySyncLog.status == "pending",
                    )
                    .first()
                )


                if not existing:

                    create_sync_log(
                        db=db,
                        user_id=user.id,
                        emby_user_id=user.emby_account.emby_user_id,
                        action="disable",
                        status="pending",
                        message="Subscription expired",
                    )


            processed += 1


        db.commit()


        return {
            "processed": processed
        }