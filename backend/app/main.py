from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import setup_logging, get_logger


setup_logging()

logger = get_logger("payarr")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


@app.on_event("startup")
def startup_event():
    logger.info(
        f"{settings.APP_NAME} started"
    )


@app.get("/")
def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
    }