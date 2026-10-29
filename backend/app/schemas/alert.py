from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


Severity = Literal["minor", "moderate", "severe", "extreme"]


class AlertResponse(BaseModel):
    id: int
    source: str
    external_id: str
    hazard_type: str
    severity: Severity
    status: Literal["active", "expired", "cancelled"]
    headline: str
    instruction: str
    area_description: str | None
    latitude: float | None
    longitude: float | None
    effective_at: datetime
    expires_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AlertListResponse(BaseModel):
    items: list[AlertResponse]
    total: int


class SubscriptionCreate(BaseModel):
    label: str = Field(min_length=1, max_length=80)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    radius_km: int = Field(default=20, ge=1, le=250)
    minimum_severity: Severity = "moderate"
    push_enabled: bool = True

    @field_validator("label")
    @classmethod
    def clean_label(cls, value: str) -> str:
        return " ".join(value.split())


class SubscriptionUpdate(BaseModel):
    label: str | None = Field(default=None, min_length=1, max_length=80)
    radius_km: int | None = Field(default=None, ge=1, le=250)
    minimum_severity: Severity | None = None
    push_enabled: bool | None = None
    is_active: bool | None = None


class SubscriptionResponse(BaseModel):
    id: int
    label: str
    latitude: float
    longitude: float
    radius_km: int
    minimum_severity: Severity
    push_enabled: bool
    is_active: bool

    model_config = {"from_attributes": True}
