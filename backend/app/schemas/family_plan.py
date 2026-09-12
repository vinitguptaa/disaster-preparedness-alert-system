from pydantic import BaseModel, Field


class FamilyPlanCreate(BaseModel):
    meeting_point: str | None = Field(default=None, max_length=255)
    emergency_contact_name: str | None = Field(default=None, max_length=100)
    emergency_contact_phone: str | None = Field(default=None, max_length=20)


class FamilyPlanResponse(BaseModel):
    id: int
    meeting_point: str | None
    emergency_contact_name: str | None
    emergency_contact_phone: str | None

    model_config = {"from_attributes": True}