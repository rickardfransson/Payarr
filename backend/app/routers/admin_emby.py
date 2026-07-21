from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.emby_sync_status import EmbySyncStatusResponse
from app.services.emby_status_service import EmbyStatusService

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