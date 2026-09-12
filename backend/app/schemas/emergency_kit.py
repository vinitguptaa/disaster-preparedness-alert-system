from pydantic import BaseModel, Field


class EmergencyKitItemCreate(BaseModel):
    item_name: str = Field(min_length=2, max_length=100)


class EmergencyKitItemResponse(BaseModel):
    id: int
    item_name: str
    is_completed: bool

    model_config = {"from_attributes": True}


class EmergencyKitItemUpdate(BaseModel):
    is_completed: bool