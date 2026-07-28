"""add emby account status fields

Revision ID: cf726c5d99be
Revises: 74448adcedf2
Create Date: 2026-07-20 16:58:03.601942

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cf726c5d99be'
down_revision: Union[str, Sequence[str], None] = '74448adcedf2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "emby_accounts",
        sa.Column(
            "enabled",
            sa.Boolean(),
            nullable=True
        )
    )

    op.add_column(
        "emby_accounts",
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=True
        )
    )

    op.add_column(
        "emby_accounts",
        sa.Column(
            "last_sync",
            sa.DateTime(),
            nullable=True
        )
    )

    op.drop_column(
        "emby_accounts",
        "active"
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.add_column(
        "emby_accounts",
        sa.Column(
            "active",
            sa.Boolean(),
            nullable=True
        )
    )

    op.drop_column(
        "emby_accounts",
        "last_sync"
    )

    op.drop_column(
        "emby_accounts",
        "status"
    )

    op.drop_column(
        "emby_accounts",
        "enabled"
    )