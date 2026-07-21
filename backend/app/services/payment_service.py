from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.subscription import Subscription


class PaymentService:


    @staticmethod
    def create_payment(
        db: Session,
        user_id: int,
        amount: float,
        provider: str = "btcpay",
    ):

        payment = Payment(
            user_id=user_id,
            amount=amount,
            provider=provider,
            status="pending",
        )

        db.add(payment)
        db.commit()
        db.refresh(payment)

        return payment



    @staticmethod
    def complete_payment(
        db: Session,
        payment: Payment,
    ):

        now = datetime.utcnow()


        payment.status = "paid"
        payment.paid_at = now


        subscription = (
            db.query(Subscription)
            .filter(
                Subscription.user_id == payment.user_id
            )
            .first()
        )


        if subscription:

            if subscription.end_date > now:
                subscription.end_date += timedelta(days=30)

            else:
                subscription.start_date = now
                subscription.end_date = (
                    now + timedelta(days=30)
                )

            subscription.active = True


        db.commit()

        db.refresh(payment)

        return payment