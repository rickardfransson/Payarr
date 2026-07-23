from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.subscription import Subscription
from app.services.payment.providers.factory import PaymentProviderFactory


class PaymentService:

    @staticmethod
    async def create_payment(
        db: Session,
        user_id: int,
        amount: float,
        provider: str = "btcpay",
    ):

        provider_client = PaymentProviderFactory.get_provider()

        invoice = await provider_client.create_invoice(
            amount=amount,
            currency="SEK",
            metadata={
                "user_id": user_id,
            },
        )


        payment = Payment(
            user_id=user_id,
            amount=amount,
            provider=provider,
            invoice_id=invoice.get("id"),
            checkout_url=invoice.get("checkoutLink"),
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

        # Skydd mot dubbel webhook
        if payment.status == "paid":
            return payment


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