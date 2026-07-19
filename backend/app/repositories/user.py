from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate


def get_users(db: Session):
    return db.query(User).all()


def create_user(
    db: Session,
    user: UserCreate
):

    db_user = User(
        email=user.email,
        username=user.username,
        password_hash=user.password_hash,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user