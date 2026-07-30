import httpx

from app.core.config import settings


class DiscordService:

    @staticmethod
    async def send_payment_report(
        username: str,
        amount: float,
    ):

        if not settings.DISCORD_WEBHOOK_URL:
            return

        payload = {
            "content": (
                "🟡 **Ny Swish-betalning rapporterad**\n\n"
                f"👤 Användare: {username}\n"
                f"💰 Belopp: {amount:.2f} SEK\n"
            )
        }

        async with httpx.AsyncClient() as client:

            await client.post(
                settings.DISCORD_WEBHOOK_URL,
                json=payload,
                timeout=10,
            )