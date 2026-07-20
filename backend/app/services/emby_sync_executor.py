from sqlalchemy.orm import Session

from app.models.emby_sync_log import EmbySyncLog
from app.services.emby import EmbyClient


class EmbySyncExecutor:

    def __init__(self):
        self.emby = EmbyClient()


    async def execute(
        self,
        db: Session,
        sync_log: EmbySyncLog
    ):

        try:
            if sync_log.action == "disable":
                await self.emby.disable_user(
                    sync_log.emby_user_id
                )

            elif sync_log.action == "enable":
                await self.emby.enable_user(
                    sync_log.emby_user_id
                )

            else:
                sync_log.status = "failed"
                sync_log.message = "Unknown action"
                db.commit()

                return sync_log


            sync_log.status = "success"
            sync_log.message = "Sync executed successfully"

        except Exception as e:
            sync_log.status = "failed"
            sync_log.message = str(e)

        db.commit()
        db.refresh(sync_log)

        return sync_log