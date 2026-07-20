from sqlalchemy.orm import Session

from app.models.user import User
from app.models.emby_sync_log import EmbySyncLog
from app.services.emby_sync_service import EmbySyncService


class SyncWorker:

    def __init__(self):
        self.sync_service = EmbySyncService()


    async def run(self, db: Session):

        users = (
            db.query(User)
            .filter(
                User.active == True
            )
            .all()
        )

        created_logs = []

        for user in users:

            result = await self.sync_service.sync_user(
                db,
                user
            )

            if not result.get("success"):
                continue


            action = result.get("action")


            if action == "none":
                continue


            existing = (
                db.query(EmbySyncLog)
                .filter(
                    EmbySyncLog.user_id == user.id,
                    EmbySyncLog.status == "pending"
                )
                .first()
            )

            if existing:
                continue


            log = EmbySyncLog(
                user_id=user.id,
                emby_user_id=result["emby_user_id"],
                action=action,
                status="pending",
                message=f"Automatic sync decision: {action}"
            )

            db.add(log)

            created_logs.append(log)


        db.commit()


        return {
            "created": len(created_logs)
        }