from pydantic_settings import BaseSettings, SettingsConfigDict


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

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()