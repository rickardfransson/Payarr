from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.payment import Payment
from app.services.payment_service import PaymentService
from app.services.payment.btcpay import BTCPayClient


router = APIRouter(
    prefix="/api/v1/webhooks",
    tags=["Webhooks"],
)


class BTCPayWebhookPayload(BaseModel):
    invoiceId: str
    type: str
    metadata: dict[str, Any] | None = None



@router.post("/btcpay")
async def btcpay_webhook(
    payload: BTCPayWebhookPayload,
):

    db: Session = SessionLocal()

    try:

        btcpay = BTCPayClient()


        # Lokalt utvecklingsläge
        if not btcpay.is_configured():

            invoice_status = "Settled"

        else:

            invoice = await btcpay.get_invoice(
                payload.invoiceId
            )

            invoice_status = invoice.get("status")



        print(
            f"BTCPay invoice {payload.invoiceId} status: {invoice_status}"
        )


        if invoice_status not in [
            "Settled",
            "Complete",
            "Completed",
        ]:
            return {
                "success": True,
                "message": "Invoice not paid yet",
                "status": invoice_status,
            }



        payment = (
            db.query(Payment)
            .filter(
                Payment.invoice_id == payload.invoiceId
            )
            .first()
        )


        if not payment:

            raise HTTPException(
                status_code=404,
                detail="Payment not found",
            )


        PaymentService.complete_payment(
            db,
            payment,
        )


        return {
            "success": True,
            "payment_id": payment.id,
            "status": payment.status,
        }


    finally:

        db.close()