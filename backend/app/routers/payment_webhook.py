from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_database
from app.models.payment import Payment
from app.services.payment_service import PaymentService


router = APIRouter(
    prefix="/payments/webhook",
    tags=["Payments"],
)


@router.post("/{invoice_id}")
def payment_webhook(
    invoice_id: str,
    db: Session = Depends(get_database),
):

    payment = (
        db.query(Payment)
        .filter(
            Payment.invoice_id == invoice_id
        )
        .first()
    )

    if not payment:
        return {
            "success": False,
            "message": "Payment not found",
        }


    PaymentService.complete_payment(
        db,
        payment,
    )


    return {
        "success": True,
        "payment_id": payment.id,
        "status": payment.status,
    }