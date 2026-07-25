from datetime import datetime

from sqlalchemy import String, DateTime, Text

from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Setting(Base):

    __tablename__ = "settings"


    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )


    key: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )


    value: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )


    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )