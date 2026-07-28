from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Importera alla modeller här så Alembic hittar dem
from app.models import *  # noqa: E402,F401