from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.database.session import SessionLocal
from app.services.sync_worker import SyncWorker
from app.services.sync_job_processor import SyncJobProcessor


scheduler = AsyncIOScheduler()


async def run_sync_job():

    db = SessionLocal()

    try:
        worker = SyncWorker()

        worker_result = await worker.run(db)


        processor = SyncJobProcessor()

        processor_result = await processor.process(db)


        print(
            f"Automatic sync completed: "
            f"worker={worker_result}, "
            f"processor={processor_result}"
        )


    except Exception as e:

        print(
            f"Automatic sync failed: {e}"
        )


    finally:
        db.close()



def start_scheduler():

    scheduler.add_job(
        run_sync_job,
        "interval",
        minutes=15,
        id="emby_sync_worker",
        replace_existing=True,
    )

    scheduler.start()



def stop_scheduler():

    scheduler.shutdown()