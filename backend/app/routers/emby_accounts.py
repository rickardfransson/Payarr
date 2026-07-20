from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_database
from app.models.emby_account import EmbyAccount
from app.schemas.emby_account import EmbyAccountResponse
from app.schemas.emby_link import EmbyAccountLink


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

@router.post(
    "/link"
)
def link_account(
    data: EmbyAccountLink,
    db: Session = Depends(get_database)
):

    account = EmbyAccount(
        user_id=data.user_id,
        emby_user_id=data.emby_user_id,
        emby_username=data.emby_username,
        active=True,
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return account