from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.database.session import SessionLocal
from app.services.sync_worker import SyncWorker


scheduler = AsyncIOScheduler()


async def run_sync_job():

    db = SessionLocal()

    try:
        worker = SyncWorker()

        result = await worker.run(db)

        print(
            f"Automatic sync completed: {result}"
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