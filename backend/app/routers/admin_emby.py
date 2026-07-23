from fastapi import APIRouter, Depends
from fastapi import HTTPException
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

from app.services.emby_import_service import EmbyImportService
from app.schemas.emby_import import (
    EmbyImportPreviewResponse,
    EmbyImportRequest,
)
from app.schemas.emby_import import (
    EmbyImportPreviewResponse,
    EmbyImportRequest,
)
from app.services.emby_subscription_service import EmbySubscriptionService
from app.models.user import User


router = APIRouter(
    prefix="/admin/emby",
    tags=["Admin - Emby"],
)



@router.get(
    "/status",
    response_model=EmbySyncStatusResponse,
)
def get_emby_status(
    db: Session = Depends(get_db),
):

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



@router.get(
    "/import-preview",
    response_model=list[EmbyImportPreviewResponse],
)
async def emby_import_preview(
    db: Session = Depends(get_db),
):

    return await EmbyImportService.get_import_preview(
        db
    )



@router.post(
    "/import"
)
async def import_emby_user(
    data: EmbyImportRequest,
    db: Session = Depends(get_db),
):

    return await EmbyImportService.import_user(
        db=db,
        emby_user_id=data.emby_user_id,
    )
@router.post(
    "/import"
)
async def import_emby_user(
    data: EmbyImportRequest,
    db: Session = Depends(get_db),
):

    try:

        return await EmbyImportService.import_user(
            db,
            data.emby_user_id
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
@router.get(
    "/waiting-subscriptions"
)
def waiting_subscriptions(
    db: Session = Depends(get_db),
):

    users = (
        db.query(User)
        .join(User.emby_account)
        .filter(
            User.emby_account.has(
                status="waiting_subscription"
            )
        )
        .all()
    )


    return [
        {
            "user_id": user.id,
            "username": user.username,
            "emby_username":
                user.emby_account.emby_username,
            "status":
                user.emby_account.status,
        }

        for user in users
    ]




@router.post(
    "/activate/{user_id}"
)
def activate_subscription(
    user_id: int,
    db: Session = Depends(get_db),
):

    return EmbySubscriptionService.activate_subscription(
        db,
        user_id
    )