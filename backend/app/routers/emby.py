from fastapi import APIRouter

from app.services.emby import EmbyClient
from app.schemas.emby import EmbyUser

from sqlalchemy.orm import Session

from app.database.session import get_database
from app.models.user import User
from app.services.emby_sync_service import EmbySyncService

from fastapi import Depends, HTTPException

router = APIRouter(
    prefix="/emby",
    tags=["Emby"],
)


@router.get("/test")
async def test_emby():

    client = EmbyClient()

    return await client.ping()
@router.get("/users", response_model=list[EmbyUser])
async def get_emby_users():

    client = EmbyClient()

    users = await client.get_users()

    return [
        {
            "id": user["Id"],
            "name": user["Name"],
            "enabled": user.get("Policy", {}).get("IsDisabled") is not True,
            "last_login": user.get("LastLoginDate")
        }
        for user in users
    ]
@router.post("/sync/{user_id}")
async def sync_user(
    user_id: int,
    db: Session = Depends(get_database),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    service = EmbySyncService()

    return await service.sync_user(db, user)