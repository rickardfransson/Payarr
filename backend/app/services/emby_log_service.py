from sqlalchemy.orm import Session

from app.models.emby_sync_log import EmbySyncLog


class EmbyLogService:

    @staticmethod
    def get_logs(db: Session, limit: int = 50):

        return (
            db.query(EmbySyncLog)
            .order_by(EmbySyncLog.created_at.desc())
            .limit(limit)
            .all()
        )