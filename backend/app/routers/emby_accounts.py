from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User

from app.database.session import get_database
from app.models.emby_account import EmbyAccount
from app.schemas.emby_account import EmbyAccountResponse
from app.schemas.emby_link import EmbyAccountLink
from app.models.subscription import Subscription
from app.schemas.emby_status import EmbyStatusResponse
from app.services.emby import EmbyClient
from app.schemas.emby_sync_preview import EmbySyncPreview
from app.services.emby import EmbyClient


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

@router.get(
    "/{user_id}/status",
    response_model=EmbyStatusResponse
)
def get_emby_status(
    user_id: int,
    db: Session = Depends(get_database)
):

    account = db.query(EmbyAccount).filter(
        EmbyAccount.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=404,
            detail="No Emby account linked"
        )

    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id
    ).first()

    subscription_active = False

    if subscription:
        subscription_active = subscription.active

    return {
        "user_id": user_id,
        "emby_user_id": account.emby_user_id,
        "emby_username": account.emby_username,
        "emby_account_active": account.active,
        "subscription_active": subscription_active,
    }
@router.get(
    "/{user_id}/details"
)
async def get_emby_details(
    user_id: int,
    db: Session = Depends(get_database)
):

    account = db.query(EmbyAccount).filter(
        EmbyAccount.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=404,
            detail="No Emby account linked"
        )

    client = EmbyClient()

    emby_user = await client.get_user(
        account.emby_user_id
    )

    return emby_user

@router.get(
    "/{user_id}/sync-preview",
    response_model=EmbySyncPreview
)
async def sync_preview(
    user_id: int,
    db: Session = Depends(get_database)
):

    account = db.query(EmbyAccount).filter(
        EmbyAccount.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=404,
            detail="No Emby account linked"
        )

    subscription = db.query(Subscription).filter(
        Subscription.user_id == user_id
    ).first()

    subscription_active = False

    if subscription:
        subscription_active = subscription.active

    client = EmbyClient()
    emby_user = await client.get_user(account.emby_user_id)

    emby_is_disabled = emby_user["Policy"]["IsDisabled"]

    if subscription_active and emby_is_disabled:
        action = "Enable Emby account"

    elif not subscription_active and not emby_is_disabled:
        action = "Disable Emby account"

    else:
        action = "No action required"

    return {
        "subscription_active": subscription_active,
        "emby_is_disabled": emby_is_disabled,
        "action": action
    }

@router.post(
    "/{user_id}/enable"
)
async def enable_emby_account(
    user_id: int,
    db: Session = Depends(get_database)
):

    account = db.query(EmbyAccount).filter(
        EmbyAccount.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=404,
            detail="No Emby account linked"
        )


    client = EmbyClient()

    await client.enable_user(
        account.emby_user_id
    )


    return {
        "success": True,
        "message": "Emby account enabled"
    }




@router.post(
    "/{user_id}/disable"
)
async def disable_emby_account(
    user_id: int,
    db: Session = Depends(get_database)
):

    account = db.query(EmbyAccount).filter(
        EmbyAccount.user_id == user_id
    ).first()

    if not account:
        raise HTTPException(
            status_code=404,
            detail="No Emby account linked"
        )


    client = EmbyClient()

    await client.disable_user(
        account.emby_user_id
    )


    return {
        "success": True,
        "message": "Emby account disabled"
    }