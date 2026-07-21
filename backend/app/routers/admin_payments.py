from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.payment import Payment
from app.services.payment_service import PaymentService


router = APIRouter(
    prefix="/admin/payments",
    tags=["Admin - Payments"],
)


@router.post("/create/{user_id}")
def create_payment(
    user_id: int,
    db: Session = Depends(get_db),
):

    return PaymentService.create_payment(
        db=db,
        user_id=user_id,
        amount=100,
    )


@router.post("/complete/{payment_id}")
def complete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
):

    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id
        )
        .first()
    )

    if not payment:
        return {
            "error": "Payment not found"
        }


    return PaymentService.complete_payment(
        db=db,
        payment=payment,
    )