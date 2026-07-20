from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text

from app.database.base import Base


class EmbySyncLog(Base):
    __tablename__ = "emby_sync_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    emby_user_id = Column(
        String,
        nullable=False
    )

    action = Column(
        String(50),
        nullable=False
    )

    status = Column(
        String(50),
        nullable=False,
        default="pending"
    )

    message = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )