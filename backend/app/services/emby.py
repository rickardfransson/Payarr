import httpx

from app.core.config import settings


class EmbyClient:
    def __init__(self):
        self.base_url = settings.EMBY_URL.rstrip("/")
        self.api_key = settings.EMBY_API_KEY

    async def ping(self):
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/System/Info",
                params={"api_key": self.api_key},
            )

            response.raise_for_status()
            return response.json()

    async def get_user(self, user_id: str):
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/Users/{user_id}",
                params={"api_key": self.api_key},
            )

            response.raise_for_status()
            return response.json()

    async def get_users(self):
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/Users",
                params={"api_key": self.api_key},
            )

            response.raise_for_status()
            return response.json()

    async def set_user_enabled(
        self,
        user_id: str,
        enabled: bool,
    ) -> bool:
        """
        Aktiverar eller avaktiverar en Emby-användare.

        Hämtar först hela användarens policy, ändrar endast
        IsDisabled och skickar tillbaka hela policyn.
        """

        user = await self.get_user(user_id)

        if not user:
            raise ValueError(f"Emby user '{user_id}' not found")

        policy = user.get("Policy")

        if policy is None:
            raise ValueError("User has no Policy object")

        policy["IsDisabled"] = not enabled

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.base_url}/Users/{user_id}/Policy",
                params={
                    "api_key": self.api_key
                },
                json=policy,
            )

            response.raise_for_status()

        return True

    async def enable_user(self, user_id: str):
        return await self.set_user_enabled(
            user_id=user_id,
            enabled=True,
        )

    async def disable_user(self, user_id: str):
        return await self.set_user_enabled(
            user_id=user_id,
            enabled=False,
        )