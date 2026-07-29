from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT_DIR = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    APP_NAME: str = "Payarr"
    APP_VERSION: str = "0.1.0"

    SECRET_KEY: str

    DATABASE_HOST: str = "database"
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = "payarr"
    DATABASE_USER: str = "payarr"
    DATABASE_PASSWORD: str = "payarrpassword"

    EMBY_URL: str
    EMBY_API_KEY: str

    BTCPAY_URL: str = ""
    BTCPAY_API_KEY: str = ""
    BTCPAY_STORE_ID: str = ""

    SWISH_NUMBER: str = ""

    PAYMENT_PROVIDER: str = "swish"
    
    CORS_ORIGINS: str = ""

    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env",
        case_sensitive=True,
    )


settings = Settings()