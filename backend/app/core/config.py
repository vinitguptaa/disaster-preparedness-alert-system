from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BACKEND_DIR / "data"
DEFAULT_DATABASE_URL = f"sqlite:///{(DATA_DIR / 'disaster_safe.db').as_posix()}"


class Settings(BaseSettings):
    APP_NAME: str = "Disaster Preparedness & Alert System"
    APP_ENV: str = "development"
    DEBUG: bool = Field(default=True, validation_alias="APP_DEBUG")

    DATABASE_URL: str = DEFAULT_DATABASE_URL

    JWT_SECRET_KEY: str = "dev-only-change-this-secret-before-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    FRONTEND_URL: str = (
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:5175,http://127.0.0.1:5175"
    )

    model_config = SettingsConfigDict(
        env_file=(BACKEND_DIR / ".env", BACKEND_DIR.parent / ".env"),
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.FRONTEND_URL.split(",") if origin.strip()]


settings = Settings()
