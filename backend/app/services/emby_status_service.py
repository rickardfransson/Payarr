from sqlalchemy.orm import Session

from app.models.emby_sync_log import EmbySyncLog


class EmbyStatusService:

    @staticmethod
    def get_status(db):

        last = (
            db.query(EmbySyncLog)
            .order_by(EmbySyncLog.created_at.desc())
            .first()
        )

        if last is None:
            return {
                "scheduler_running": True,
                "last_sync": None,
                "last_status": None,
                "users_checked": 0,
                "users_updated": 0,
                "users_disabled": 0,
                "next_sync": None,
            }

        return {
            "scheduler_running": True,
            "last_sync": last.created_at,
            "last_status": last.status,
            "users_checked": 0,
            "users_updated": 0,
            "users_disabled": 0,
            "next_sync": None,
        }