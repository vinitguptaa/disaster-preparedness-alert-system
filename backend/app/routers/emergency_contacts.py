from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models import EmergencyContact
from app.schemas.emergency_contact import (
    EmergencyContactCreate,
    EmergencyContactResponse,
)

router = APIRouter(
    prefix="/api/emergency-contacts",
    tags=["Emergency Contacts"],
)


@router.get("", response_model=list[EmergencyContactResponse])
def get_contacts(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    contacts = db.scalars(
        select(EmergencyContact)
        .where(EmergencyContact.user_id == user_id)
        .order_by(EmergencyContact.id)
    ).all()

    return contacts


@router.post(
    "",
    response_model=EmergencyContactResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_contact(
    data: EmergencyContactCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    contact = EmergencyContact(
        user_id=user_id,
        name=data.name,
        phone=data.phone,
        relationship_type=data.relationship_type,
    )

    db.add(contact)
    db.commit()
    db.refresh(contact)

    return contact


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    contact_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    contact = db.scalar(
        select(EmergencyContact).where(
            EmergencyContact.id == contact_id,
            EmergencyContact.user_id == user_id,
        )
    )

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency contact not found",
        )

    db.delete(contact)
    db.commit()