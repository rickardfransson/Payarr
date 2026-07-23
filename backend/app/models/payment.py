from datetime import datetime

from sqlalchemy import (
    String,
    Integer,
    DateTime,
    ForeignKey,
    Numeric,
)

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Payment(Base):

    __tablename__ = "payments"


    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )


    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )


    provider: Mapped[str] = mapped_column(
        String(50),
        default="btcpay",
    )


    invoice_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    checkout_url: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
)


    amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )


    currency: Mapped[str] = mapped_column(
        String(10),
        default="SEK",
    )


    status: Mapped[str] = mapped_column(
        String(50),
        default="pending",
    )


    paid_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )


    user = relationship(
        "User",
        back_populates="payments",
    )