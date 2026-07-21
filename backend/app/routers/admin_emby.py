from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.emby_sync_status import EmbySyncStatusResponse
from app.services.emby_status_service import EmbyStatusService
from app.schemas.emby_log import EmbyLogResponse
from app.services.emby_log_service import EmbyLogService
from app.schemas.emby_sync_run import EmbySyncRunResponse
from app.services.emby_manual_sync import EmbyManualSyncService
from app.schemas.emby_user_status import EmbyUserStatusResponse
from app.services.emby_user_status_service import EmbyUserStatusService

router = APIRouter(
    prefix="/admin/emby",
    tags=["Admin - Emby"],
)


@router.get(
    "/status",
    response_model=EmbySyncStatusResponse,
)
def get_emby_status(db: Session = Depends(get_db)):
    return EmbyStatusService.get_status(db)

@router.get(
    "/logs",
    response_model=list[EmbyLogResponse],
)
def get_emby_logs(
    db: Session = Depends(get_db),
):
    return EmbyLogService.get_logs(db)
@router.post(
    "/sync",
    response_model=EmbySyncRunResponse,
)
async def run_emby_sync(
    db: Session = Depends(get_db),
):
    return await EmbyManualSyncService.run(db)
@router.get(
    "/users",
    response_model=list[EmbyUserStatusResponse],
)
async def get_emby_users(
    db: Session = Depends(get_db),
):
    service = EmbyUserStatusService()

    return await service.get_users(db)