from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_database

from app.models.user import User
from app.models.payment import Payment
from app.models.emby_account import EmbyAccount

from app.core.dependencies import get_current_admin


router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin Dashboard"],
)


@router.get("/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin),
):

    users = (
        db.query(User)
        .count()
    )


    active_subscriptions = (
        db.query(User)
        .filter(
            User.subscription != None
        )
        .count()
    )


    payments_total = (
        db.query(Payment)
        .count()
    )


    emby_accounts = (
        db.query(EmbyAccount)
        .count()
    )


    return {
        "users": users,
        "active_subscriptions": active_subscriptions,
        "payments_total": payments_total,
        "emby_accounts": emby_accounts,
    }