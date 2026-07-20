from sqlalchemy.orm import Session

from app.models.emby_sync_log import EmbySyncLog
from app.services.emby_sync_executor import EmbySyncExecutor


class SyncJobProcessor:

    def __init__(self):
        self.executor = EmbySyncExecutor()


    async def process(
        self,
        db: Session
    ):

        jobs = (
            db.query(EmbySyncLog)
            .filter(
                EmbySyncLog.status == "pending"
            )
            .all()
        )

        processed = 0
        failed = 0


        for job in jobs:

            result = await self.executor.execute(
                db,
                job
            )

            processed += 1

            if result.status == "failed":
                failed += 1


        return {
            "processed": processed,
            "failed": failed
        }