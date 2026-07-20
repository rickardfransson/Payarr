from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_database
from app.models.emby_account import EmbyAccount
from app.schemas.emby_account import EmbyAccountResponse


router = APIRouter(
    prefix="/emby/accounts",
    tags=["Emby Accounts"],
)


@router.get(
    "/",
    response_model=list[EmbyAccountResponse]
)
def get_accounts(
    db: Session = Depends(get_database)
):

    return db.query(EmbyAccount).all()