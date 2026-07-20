from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User

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
@router.post(
    "/link",
    response_model=EmbyAccountResponse
)
def link_account(
    data: EmbyAccountLink,
    db: Session = Depends(get_database)
):

    # Kontrollera att Payarr-användaren finns
    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Payarr user not found"
        )

    # Kontrollera om användaren redan har ett Emby-konto
    existing_account = db.query(EmbyAccount).filter(
        EmbyAccount.user_id == data.user_id
    ).first()

    if existing_account:
        raise HTTPException(
            status_code=400,
            detail="User already has an Emby account linked"
        )

    # Kontrollera om Emby-kontot redan används
    existing_emby = db.query(EmbyAccount).filter(
        EmbyAccount.emby_user_id == data.emby_user_id
    ).first()

    if existing_emby:
        raise HTTPException(
            status_code=400,
            detail="Emby account already linked"
        )

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