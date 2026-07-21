import uuid

from app.services.payment.providers.base import PaymentProvider


class MockPaymentProvider(PaymentProvider):

    async def create_invoice(
        self,
        amount: float,
        currency: str,
        metadata: dict,
    ):

        return {
            "id": str(uuid.uuid4()),
            "status": "pending",
            "amount": amount,
            "currency": currency,
            "checkoutLink": "http://localhost/mock-payment",
            "metadata": metadata,
        }