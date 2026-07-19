from fastapi import APIRouter, Depends

from app.models.user import User
from app.core.dependencies import get_current_admin

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin"]
)


@router.get("/test")
def admin_test(
    current_user: User = Depends(get_current_admin)
):
    return {
        "message": "Welcome Admin",
        "username": current_user.username,
        "role": current_user.role
    }