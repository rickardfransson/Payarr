from urllib.parse import quote


from app.core.config import settings


class SwishProvider:


    async def create_invoice(
        self,
        amount: float,
        currency: str = "SEK",
        metadata: dict | None = None,
    ):

        message = "Payarr abonnemang"

        if metadata and "user_id" in metadata:
            message = f"Payarr user {metadata['user_id']}"


        data = (
            f"{settings.SWISH_NUMBER}"
            f";{amount}"
            f";{message}"
        )


        checkout_url = (
            "swish://payment?data="
            + quote(data)
        )


        return {
            "id": None,
            "checkoutLink": checkout_url,
        }