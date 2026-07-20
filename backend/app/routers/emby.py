from fastapi import APIRouter

from app.services.emby import EmbyClient
from app.schemas.emby import EmbyUser

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