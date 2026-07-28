from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_database
from app.models.user import User
from app.models.payment import Payment
from app.core.dependencies import get_current_admin
from app.schemas.admin_subscription import SubscriptionActivateRequest
from app.schemas.admin_user import UserRoleUpdate

from app.services.admin_subscription_service import AdminSubscriptionService
from app.core.security import hash_password


router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin"]
)


@router.get("/test")
def admin_test(
    current_user: User = Depends(get_current_admin)
):
    return {
        "message": "Welcome Admin",
        "username": current_user.username,
        "role": current_user.role
    }


@router.get("/users")
def get_users(
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin)
):

    users = (
        db.query(User)
        .all()
    )

    result = []

    for user in users:

        last_payment = (
            db.query(Payment)
            .filter(
                Payment.user_id == user.id
            )
            .order_by(
                Payment.created_at.desc()
            )
            .first()
        )

        result.append(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "active": user.active,

                "subscription": (
                    {
                        "active": user.subscription.active,
                        "end_date": user.subscription.end_date,
                    }
                    if user.subscription
                    else None
                ),

                "emby": (
                    {
                        "username": user.emby_account.emby_username,
                    }
                    if user.emby_account
                    else None
                ),

                "last_payment": (
                    {
                        "amount": last_payment.amount,
                        "status": last_payment.status,
                        "paid_at": last_payment.paid_at,
                    }
                    if last_payment
                    else None
                ),
            }
        )

    return result


@router.post("/users/{user_id}/activate-subscription")
def activate_subscription(
    user_id: int,
    request: SubscriptionActivateRequest,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return AdminSubscriptionService.activate(
        db=db,
        user=user,
        end_date=request.end_date
    )


@router.post("/users/{user_id}/reset-password")
def reset_password(
    user_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    temporary_password = user.username

    user.password_hash = hash_password(
        temporary_password
    )

    user.must_change_password = True

    db.commit()
    db.refresh(user)

    return {
        "message": "Password reset",
        "temporary_password": temporary_password,
        "must_change_password": True
    }


@router.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    request: UserRoleUpdate,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if request.role not in ["user", "admin"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )

    user.role = request.role

    db.commit()
    db.refresh(user)

    return {
        "message": "Role updated",
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role
        }
    }