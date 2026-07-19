from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.session import get_database
from app.schemas.user import UserCreate, UserResponse
from app.services import user as user_service


router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


@router.get(
    "",
    response_model=list[UserResponse]
)
def list_users(
    db: Session = Depends(get_database)
):
    return user_service.get_users(db)


@router.post(
    "",
    response_model=UserResponse
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_database)
):
    return user_service.create_user(db, user)