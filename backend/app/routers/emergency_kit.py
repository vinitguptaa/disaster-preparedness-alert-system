from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models import EmergencyKitItem
from app.schemas.emergency_kit import (
    EmergencyKitItemCreate,
    EmergencyKitItemResponse,
    EmergencyKitItemUpdate,
)

router = APIRouter(
    prefix="/api/emergency-kit",
    tags=["Emergency Kit"],
)


@router.get(
    "",
    response_model=list[EmergencyKitItemResponse],
)
def get_emergency_kit(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    items = db.scalars(
        select(EmergencyKitItem)
        .where(EmergencyKitItem.user_id == user_id)
        .order_by(EmergencyKitItem.id)
    ).all()

    return items


@router.post(
    "",
    response_model=EmergencyKitItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_emergency_kit_item(
    data: EmergencyKitItemCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    item = EmergencyKitItem(
        user_id=user_id,
        item_name=data.item_name,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.patch(
    "/{item_id}",
    response_model=EmergencyKitItemResponse,
)
def update_emergency_kit_item(
    item_id: int,
    data: EmergencyKitItemUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    item = db.scalar(
        select(EmergencyKitItem).where(
            EmergencyKitItem.id == item_id,
            EmergencyKitItem.user_id == user_id,
        )
    )

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency kit item not found",
        )

    item.is_completed = data.is_completed

    db.commit()
    db.refresh(item)

    return item