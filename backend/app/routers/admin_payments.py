from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_database
from app.models.payment import Payment
from app.models.user import User
from app.services.payment_service import PaymentService

router = APIRouter(
    prefix="/api/v1/admin/payments",
    tags=["Admin Payments"],
)


def require_admin(user: User):
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin only",
        )


@router.get("/")
def get_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database),
):

    require_admin(current_user)

    payments = (
        db.query(Payment)
        .order_by(Payment.created_at.desc())
        .all()
    )

    return [
        {
            "id": payment.id,
            "username": payment.user.username,
            "amount": float(payment.amount),
            "currency": payment.currency,
            "provider": payment.provider,
            "status": payment.status,
            "created_at": payment.created_at,
            "paid_at": payment.paid_at,
        }
        for payment in payments
    ]


@router.post("/complete/{payment_id}")
def complete_payment(
    payment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database),
):

    require_admin(current_user)

    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    if payment.status != "paid":

        payment.status = "paid"
        payment.paid_at = datetime.utcnow()

        db.commit()
        db.refresh(payment)

        PaymentService.complete_payment(
            db=db,
            payment_id=payment.id,
        )

    return {
        "success": True,
    }