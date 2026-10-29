"""add alert platform

Revision ID: a1b2c3d4e5f6
Revises: 569b01ea479c
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "569b01ea479c"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "alerts",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("source", sa.String(60), nullable=False),
        sa.Column("external_id", sa.String(160), nullable=False),
        sa.Column("hazard_type", sa.String(60), nullable=False),
        sa.Column("severity", sa.String(20), nullable=False),
        sa.Column("status", sa.String(20), nullable=False),
        sa.Column("headline", sa.String(280), nullable=False),
        sa.Column("instruction", sa.Text(), nullable=False),
        sa.Column("area_description", sa.String(500), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("effective_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("source", "external_id", name="uq_alert_source_external_id"),
    )
    op.create_index("ix_alerts_source", "alerts", ["source"])
    op.create_index("ix_alerts_hazard_type", "alerts", ["hazard_type"])
    op.create_index("ix_alerts_severity", "alerts", ["severity"])
    op.create_index("ix_alerts_status", "alerts", ["status"])
    op.create_index("ix_alerts_effective_at", "alerts", ["effective_at"])
    op.create_index("ix_alerts_expires_at", "alerts", ["expires_at"])

    op.create_table(
        "alert_subscriptions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("label", sa.String(80), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("radius_km", sa.Integer(), nullable=False),
        sa.Column("minimum_severity", sa.String(20), nullable=False),
        sa.Column("push_enabled", sa.Boolean(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_alert_subscriptions_user_id", "alert_subscriptions", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_alert_subscriptions_user_id", table_name="alert_subscriptions")
    op.drop_table("alert_subscriptions")
    for index in ["ix_alerts_expires_at", "ix_alerts_effective_at", "ix_alerts_status", "ix_alerts_severity", "ix_alerts_hazard_type", "ix_alerts_source"]:
        op.drop_index(index, table_name="alerts")
    op.drop_table("alerts")
