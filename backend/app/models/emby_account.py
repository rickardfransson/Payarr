from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class EmbyAccount(Base):
    __tablename__ = "emby_accounts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    emby_user_id = Column(
        String,
        nullable=False,
        unique=True
    )

    emby_username = Column(
        String,
        nullable=False
    )

    active = Column(
        Boolean,
        default=True
    )

    created = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


    user = relationship(
        "User",
        back_populates="emby_account"
    )