from sqlalchemy.orm import Session
from sqlalchemy import inspect

from app.core.config import settings
from app.core.logging import get_logger
from app.core.security import hash_password
from app.database.session import SessionLocal
from app.models.user import User


logger = get_logger("bootstrap")


def ensure_admin_exists():
    db: Session = SessionLocal()

    try:
        # Kontrollera att users-tabellen finns
        inspector = inspect(db.bind)

        if "users" not in inspector.get_table_names():
            logger.warning(
                "Users table does not exist yet, skipping admin bootstrap"
            )
            return

        admin = (
            db.query(User)
            .filter(User.role == "admin")
            .first()
        )

        if admin:
            logger.info("Admin user already exists")
            return

        admin = User(
            username=settings.ADMIN_USERNAME,
            email=settings.ADMIN_EMAIL,
            password_hash=hash_password(settings.ADMIN_PASSWORD),
            role="admin",
            active=True,
        )

        db.add(admin)
        db.commit()

        logger.warning(
            f"Created initial admin user: {settings.ADMIN_USERNAME}"
        )

    finally:
        db.close()