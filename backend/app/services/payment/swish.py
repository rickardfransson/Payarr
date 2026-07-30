from urllib.parse import quote

from app.core.config import settings
from app.models.emby_account import EmbyAccount
from app.models.user import User


class SwishProvider:

    async def create_invoice(
        self,
        amount: float,
        currency: str = "SEK",
        metadata: dict | None = None,
    ):

        message = "Payarr abonnemang"

        if metadata and "db" in metadata and "user_id" in metadata:

            db = metadata["db"]
            user_id = metadata["user_id"]

            emby = (
                db.query(EmbyAccount)
                .filter(EmbyAccount.user_id == user_id)
                .first()
            )

            if emby and emby.emby_username:
                message = f"Payarr {emby.emby_username}"
            else:
                user = (
                    db.query(User)
                    .filter(User.id == user_id)
                    .first()
                )

                if user:
                    message = f"Payarr {user.username}"

        amount_str = f"{amount:.2f}"

        data = (
            f"{settings.SWISH_NUMBER}"
            f";{amount_str}"
            f";{message}"
        )

        checkout_url = (
            "swish://payment?data="
            + quote(data, safe="")
        )

        return {
            "id": None,
            "checkoutLink": checkout_url,
        }