from alembic import command
from alembic.config import Config

from app.core.config import BACKEND_DIR, DATA_DIR, settings


def run_migrations() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    alembic_cfg = Config(str(BACKEND_DIR / "alembic.ini"))
    alembic_cfg.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL.replace("%", "%%"))
    command.upgrade(alembic_cfg, "head")
