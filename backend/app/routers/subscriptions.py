from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_database
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.subscription import SubscriptionResponse
from app.services.subscription_service import (
    create_subscription,
    extend_subscription,
)


router = APIRouter(
    prefix="/api/v1/subscriptions",
    tags=["Subscriptions"],
)

@router.post(
    "/{user_id}/create",
    response_model=SubscriptionResponse,
)
def create_user_subscription(
    user_id: int,
    db: Session = Depends(get_database),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.subscription:
        raise HTTPException(
            status_code=400,
            detail="User already has subscription",
        )

    return create_subscription(
        db,
        user_id,
    )

@router.post(
    "/{subscription_id}/extend",
    response_model=SubscriptionResponse,
)
def extend_user_subscription(
    subscription_id: int,
    db: Session = Depends(get_database),
):

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.id == subscription_id
        )
        .first()
    )

    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    return extend_subscription(
        db,
        subscription,
    )

@router.get(
    "/{user_id}",
    response_model=SubscriptionResponse,
)
def get_subscription(
    user_id: int,
    db: Session = Depends(get_database),
):

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user_id
        )
        .first()
    )

    if not subscription:
        raise HTTPException(
            status_code=404,
            detail="Subscription not found",
        )

    return subscription