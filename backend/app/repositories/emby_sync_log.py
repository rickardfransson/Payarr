from sqlalchemy.orm import Session

from app.models.emby_sync_log import EmbySyncLog


def create_sync_log(
    db: Session,
    user_id: int,
    emby_user_id: str,
    action: str,
    status: str,
    message: str | None = None,
):
    log = EmbySyncLog(
        user_id=user_id,
        emby_user_id=emby_user_id,
        action=action,
        status=status,
        message=message,
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log