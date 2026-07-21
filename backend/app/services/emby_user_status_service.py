from sqlalchemy.orm import Session

from app.models.user import User
from app.services.emby import EmbyClient


class EmbyUserStatusService:

    def __init__(self):
        self.emby = EmbyClient()


    async def get_users(self, db: Session):

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


            emby_active = False

            try:
                emby_user = await self.emby.get_user(
                    user.emby_account.emby_user_id
                )

                if emby_user:
                    policy = emby_user.get(
                        "Policy",
                        {}
                    )

                    emby_active = not policy.get(
                        "IsDisabled",
                        False
                    )

            except Exception:
                emby_active = False


            result.append(
                {
                    "user_id": user.id,
                    "username": user.username,
                    "emby_username": (
                        user.emby_account.emby_username
                    ),
                    "subscription_active": subscription_active,
                    "emby_active": emby_active,
                }
            )

        return result