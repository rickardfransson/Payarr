from sqlalchemy.orm import Session

from app.models.user import User


class EmbyUserStatusService:

    @staticmethod
    def get_users(db: Session):

        users = (
            db.query(User)
            .filter(User.emby_account != None)
            .all()
        )

        result = []

        for user in users:

            subscription_active = False

            if user.subscription:
                subscription_active = user.subscription.active

            result.append(
                {
                    "user_id": user.id,
                    "username": user.username,
                    "emby_username": (
                        user.emby_account.emby_username
                    ),
                    "subscription_active": subscription_active,
                }
            )

        return result