from datetime import datetime

from sqlalchemy.orm import Session

from app.models.user import User


class SubscriptionExpiryService:


    @staticmethod
    def find_expired_users(
        db: Session,
    ):

        now = datetime.utcnow()

        users = (
            db.query(User)
            .join(User.subscription)
            .filter(
                User.subscription.has(
                    end_date < now
                ),
                User.subscription.has(
                    active=True
                ),
            )
            .all()
        )

        return users