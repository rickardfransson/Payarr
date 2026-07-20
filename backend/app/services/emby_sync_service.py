from sqlalchemy.orm import Session

from app.models.user import User
from app.services.emby import EmbyClient
from app.repositories.emby_sync_log import create_sync_log


class EmbySyncService:
    def __init__(self):
        self.emby = EmbyClient()

    @staticmethod
    def should_be_enabled(user: User) -> bool:
        """
        Avgör om användaren ska vara aktiv i Emby.
        """

        if user.subscription is None:
            return False

        return user.subscription.active

    async def sync_user(self, db: Session, user: User):
        """
        Jämför Payarr-status mot Emby-status.

        Gör inga ändringar i Emby ännu.
        Returnerar endast rekommenderad åtgärd.
        """

        if user.emby_account is None:
            return {
                "success": False,
                "action": "none",
                "reason": "User is not linked to an Emby account"
            }

        emby_id = user.emby_account.emby_user_id

        desired_enabled = self.should_be_enabled(user)

        try:
            emby_user = await self.emby.get_user(emby_id)

        except Exception as e:
            return {
                "success": False,
                "action": "none",
                "reason": str(e)
            }

        if not emby_user:
            return {
                "success": False,
                "action": "none",
                "reason": "Emby user not found"
            }

        policy = emby_user.get("Policy", {})

        currently_disabled = policy.get(
            "IsDisabled",
            False
        )

        currently_enabled = not currently_disabled

        if desired_enabled and currently_disabled:
            action = "enable"

        elif not desired_enabled and currently_enabled:
            action = "disable"

        else:
            action = "none"

        if action != "none":
            create_sync_log(
                db=db,
                user_id=user.id,
                emby_user_id=emby_id,
                action=action,
                status="pending",
                message=f"Sync decision: {action}"
            )

        return {
            "success": True,
            "action": action,
            "payarr_enabled": desired_enabled,
            "emby_enabled": currently_enabled,
            "emby_user_id": emby_id,
            "emby_username": user.emby_account.emby_username,
            "payarr_username": user.username,
        }