from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_database
from app.models.payment import Payment
from app.models.user import User

from app.core.dependencies import get_current_admin

from app.services.payment_service import PaymentService


router = APIRouter(
    prefix="/api/v1/admin/payments",
    tags=["Admin - Payments"],
)


@router.get("/")
def list_payments(
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin),
):

    payments = (
        db.query(Payment)
        .order_by(
            Payment.created_at.desc()
        )
        .all()
    )


    return [
        {
            "id": payment.id,
            "user_id": payment.user_id,
            "username": payment.user.username,

            "amount": float(payment.amount),
            "currency": payment.currency,

            "provider": payment.provider,
            "status": payment.status,

            "checkout_url": payment.checkout_url,

            "paid_at": payment.paid_at,
            "created_at": payment.created_at,
        }
        for payment in payments
    ]



@router.post("/create/{user_id}")
async def create_payment(
    user_id: int,
    amount: float = 100,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin),
):

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )


    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    payment = await PaymentService.create_payment(
        db=db,
        user_id=user_id,
        amount=amount,
        provider="swish",
    )


    return {
        "id": payment.id,
        "user_id": payment.user_id,
        "amount": float(payment.amount),
        "currency": payment.currency,
        "provider": payment.provider,
        "checkout_url": payment.checkout_url,
        "status": payment.status,
    }



@router.post("/complete/{payment_id}")
def complete_payment(
    payment_id: int,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_admin),
):

    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id
        )
        .first()
    )


    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )


    payment = PaymentService.complete_payment(
        db=db,
        payment=payment,
    )


    return {
        "success": True,
        "payment_id": payment.id,
        "status": payment.status,
    }