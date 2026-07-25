from sqlalchemy.orm import Session

from app.models.setting import Setting


class SettingsService:

    @staticmethod
    def get_value(
        db: Session,
        key: str,
        default: str | None = None,
    ):

        setting = (
            db.query(Setting)
            .filter(
                Setting.key == key
            )
            .first()
        )

        if setting:
            return setting.value

        return default


    @staticmethod
    def get_subscription_price(
        db: Session,
    ) -> float:

        value = SettingsService.get_value(
            db,
            "subscription_price",
            "100",
        )

        return float(value)