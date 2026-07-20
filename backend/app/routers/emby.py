from fastapi import APIRouter

from app.services.emby import EmbyClient

router = APIRouter(
    prefix="/emby",
    tags=["Emby"],
)


@router.get("/test")
async def test_emby():

    client = EmbyClient()

    return await client.ping()
@router.get("/users")
async def get_emby_users():
    client = EmbyClient()
    return await client.get_users()