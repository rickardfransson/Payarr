from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_database
from app.models.payment import Payment
from app.models.user import User
from app.services.payment_service import PaymentService


router = APIRouter(
    prefix="/api/v1/payments",
    tags=["Payments"],
)


class CreatePaymentRequest(BaseModel):
    amount: float = 100


@router.post("/create")
async def create_payment(
    request: CreatePaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database),
):

    payment = await PaymentService.create_payment(
        db=db,
        user_id=current_user.id,
        amount=request.amount,
    )

    return {
        "id": payment.id,
        "invoice_id": payment.invoice_id,
        "checkout_url": payment.checkout_url,
        "status": payment.status,
        "amount": float(payment.amount),
        "currency": payment.currency,
        "provider": payment.provider,
    }



@router.get("/me")
def get_my_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database),
):

    payments = (
        db.query(Payment)
        .filter(
            Payment.user_id == current_user.id
        )
        .order_by(
            Payment.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": payment.id,
            "invoice_id": payment.invoice_id,
            "checkout_url": payment.checkout_url,
            "amount": float(payment.amount),
            "currency": payment.currency,
            "status": payment.status,
            "provider": payment.provider,
            "paid_at": payment.paid_at,
            "created_at": payment.created_at,
        }
        for payment in payments
    ]



@router.get("/{payment_id}")
def get_payment(
    payment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database),
):

    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id,
            Payment.user_id == current_user.id,
        )
        .first()
    )


    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )


    return {
        "id": payment.id,
        "invoice_id": payment.invoice_id,
        "checkout_url": payment.checkout_url,
        "status": payment.status,
        "amount": float(payment.amount),
        "currency": payment.currency,
        "provider": payment.provider,
        "paid_at": payment.paid_at,
        "created_at": payment.created_at,
    }