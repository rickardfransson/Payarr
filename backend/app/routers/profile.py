from fastapi import APIRouter, Depends

from app.models.user import User
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/v1",
    tags=["Profile"]
)


@router.get("/me")
def read_current_user(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "role": current_user.role,
        "active": current_user.active
    }