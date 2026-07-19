from fastapi import FastAPI
from sqlalchemy import text

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.database.session import engine
from app.routers import users
from app.routers import auth
from app.routers import profile
from app.routers import admin


# Starta loggning
setup_logging()

logger = get_logger("payarr")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(admin.router)

@app.on_event("startup")
def startup_event():
    logger.info(f"{settings.APP_NAME} started")


@app.get("/")
def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/database")
def database_test():
    try:
        with engine.connect() as connection:
            result = connection.execute(
                text("SELECT 1")
            )

        return {
            "database": "connected",
            "result": result.scalar()
        }

    except Exception as e:
        logger.error(f"Database connection failed: {e}")

        return {
            "database": "error",
            "message": str(e)
        }