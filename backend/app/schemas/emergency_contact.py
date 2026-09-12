from pydantic import BaseModel, Field


class EmergencyContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=7, max_length=20)
    relationship_type: str = Field(min_length=2, max_length=50)


class EmergencyContactResponse(BaseModel):
    id: int
    name: str
    phone: str
    relationship_type: str

    model_config = {"from_attributes": True}