import httpx

from app.core.config import settings


class BTCPayClient:

    def __init__(self):

        self.base_url = settings.BTCPAY_URL
        self.store_id = settings.BTCPAY_STORE_ID

        self.headers = {
            "Authorization": f"token {settings.BTCPAY_API_KEY}",
            "Content-Type": "application/json",
        }


    async def create_invoice(
        self,
        amount: float,
        currency: str = "SEK",
        metadata: dict | None = None,
    ):

        payload = {
            "amount": amount,
            "currency": currency,
            "metadata": metadata or {},
        }

        async with httpx.AsyncClient() as client:

            response = await client.post(
                f"{self.base_url}/api/v1/stores/{self.store_id}/invoices",
                json=payload,
                headers=self.headers,
            )

        response.raise_for_status()

        return response.json()


    async def get_invoice(
        self,
        invoice_id: str,
    ):

        async with httpx.AsyncClient() as client:

            response = await client.get(
                f"{self.base_url}/api/v1/stores/{self.store_id}/invoices/{invoice_id}",
                headers=self.headers,
            )

        response.raise_for_status()

        return response.json()