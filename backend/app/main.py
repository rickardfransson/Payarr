from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.database.session import engine

from app.routers import (
    users,
    auth,
    profile,
    admin,
    subscriptions,
    emby,
    emby_accounts,
    admin_emby,
    admin_payments,
    payment_webhook,
    user_overview,
    btcpay_webhook,
    account,
    admin_dashboard,
)

from app.services.scheduler import (
    start_scheduler,
    stop_scheduler,
)


# Starta loggning
setup_logging()

logger = get_logger("payarr")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

# CORS för frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(admin.router)
app.include_router(subscriptions.router)
app.include_router(account.router)

app.include_router(
    emby.router,
    prefix="/api/v1",
)

app.include_router(
    emby_accounts.router,
    prefix="/api/v1",
)

app.include_router(
    admin_emby.router,
    prefix="/api/v1",
)

app.include_router(
    admin_payments.router,
    prefix="/api/v1",
)

app.include_router(
    admin_dashboard.router,
)

app.include_router(
    payment_webhook.router,
    prefix="/api/v1",
)

app.include_router(
    user_overview.router,
    prefix="/api/v1",
)

app.include_router(
    btcpay_webhook.router,
)


@app.on_event("startup")
def startup_event():

    logger.info(
        f"{settings.APP_NAME} started"
    )

    start_scheduler()

    logger.info(
        "Scheduler started"
    )


@app.on_event("shutdown")
def shutdown_event():

    stop_scheduler()

    logger.info(
        "Scheduler stopped"
    )


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
        "status": "healthy",
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
            "result": result.scalar(),
        }

    except Exception as e:

        logger.error(
            f"Database connection failed: {e}"
        )

        return {
            "database": "error",
            "message": str(e),
        }