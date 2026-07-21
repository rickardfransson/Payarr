from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_database

from app.schemas.user_overview import UserOverviewResponse
from app.services.user_overview_service import UserOverviewService


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/{user_id}/overview",
    response_model=UserOverviewResponse,
)
def get_user_overview(
    user_id: int,
    db: Session = Depends(get_database),
):

    return UserOverviewService.get_user_overview(
        db,
        user_id,
    )