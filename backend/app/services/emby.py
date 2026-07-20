import httpx


from app.core.config import settings


class EmbyClient:
    def __init__(self):
        self.base_url = settings.EMBY_URL.rstrip("/")
        self.api_key = settings.EMBY_API_KEY

    async def ping(self):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/System/Info",
                params={
                    "api_key": self.api_key
                }
            )

            response.raise_for_status()

            return response.json()

    async def get_user(self, user_id: str):
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/Users/{user_id}",
                params={
                    "api_key": self.api_key
                }
            )

            response.raise_for_status()

            return response.json()

    async def get_users(self):
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/Users",
                params={
                    "api_key": self.api_key
                }
            )

            response.raise_for_status()

            return response.json()

    async def disable_user(self, user_id: str):
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.base_url}/Users/{user_id}/Policy",
                params={
                    "api_key": self.api_key
                },
                json={
                    "IsDisabled": True
                }
            )

            response.raise_for_status()

            return True


    async def enable_user(self, user_id: str):
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.base_url}/Users/{user_id}/Policy",
                params={
                    "api_key": self.api_key
                },
                json={
                    "IsDisabled": False
                }
            )

            response.raise_for_status()

            return True
