from sqlalchemy.orm import Session

from app.services.sync_worker import SyncWorker
from app.services.sync_job_processor import SyncJobProcessor


class EmbyManualSyncService:

    @staticmethod
    async def run(db: Session):

        worker = SyncWorker()

        worker_result = await worker.run(db)

        processor = SyncJobProcessor()

        processor_result = await processor.process(db)

        return {
            "status": "success",
            "worker": worker_result,
            "processor": processor_result,
        }