from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.subscription import Subscription


def create_subscription(
    db: Session,
    user_id: int,
):
    now = datetime.now()

    subscription = Subscription(
        user_id=user_id,
        start_date=now,
        end_date=now + timedelta(days=30),
        active=True,
        auto_renew=False,
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return subscription


def extend_subscription(
    db: Session,
    subscription: Subscription,
    days: int = 30,
):
    now = datetime.now()

    # Om abonnemanget redan gått ut börjar vi från idag
    if subscription.end_date < now:
        subscription.end_date = now + timedelta(days=days)
    else:
        subscription.end_date += timedelta(days=days)

    subscription.active = True

    db.commit()
    db.refresh(subscription)

    return subscription


def is_subscription_active(
    subscription: Subscription,
):
    now = datetime.now()

    return (
        subscription.active
        and subscription.end_date > now
    )