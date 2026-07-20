from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_database

from app.models.user import User
from app.models.emby_sync_log import EmbySyncLog

from app.schemas.emby import EmbyUser

from app.services.emby import EmbyClient
from app.services.emby_sync_service import EmbySyncService
from app.services.emby_sync_executor import EmbySyncExecutor
from app.services.sync_worker import SyncWorker


router = APIRouter(
    prefix="/emby",
    tags=["Emby"],
)


@router.get("/test")
async def test_emby():

    client = EmbyClient()

    return await client.ping()


@router.get("/users", response_model=list[EmbyUser])
async def get_emby_users():

    client = EmbyClient()

    users = await client.get_users()

    return [
        {
            "id": user["Id"],
            "name": user["Name"],
            "enabled": user.get("Policy", {}).get("IsDisabled") is not True,
            "last_login": user.get("LastLoginDate")
        }
        for user in users
    ]


@router.post("/sync/worker")
async def run_sync_worker(
    db: Session = Depends(get_database),
):

    worker = SyncWorker()

    return await worker.run(db)


@router.post("/sync/{user_id}")
async def sync_user(
    user_id: int,
    db: Session = Depends(get_database),
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    service = EmbySyncService()

    return await service.sync_user(db, user)


@router.post("/sync/execute/{log_id}")
async def execute_sync(
    log_id: int,
    db: Session = Depends(get_database),
):

    sync_log = (
        db.query(EmbySyncLog)
        .filter(EmbySyncLog.id == log_id)
        .first()
    )

    if not sync_log:
        raise HTTPException(
            status_code=404,
            detail="Sync log not found"
        )

    if sync_log.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Sync log already processed"
        )

    executor = EmbySyncExecutor()

    return await executor.execute(
        db,
        sync_log
    )