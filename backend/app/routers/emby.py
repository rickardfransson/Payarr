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