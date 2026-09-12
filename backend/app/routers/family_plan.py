from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models import FamilyEmergencyPlan
from app.schemas.family_plan import FamilyPlanCreate, FamilyPlanResponse

router = APIRouter(
    prefix="/api/family-plan",
    tags=["Family Emergency Plan"],
)


@router.get("", response_model=FamilyPlanResponse | None)
def get_family_plan(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    plan = db.scalar(
        select(FamilyEmergencyPlan).where(
            FamilyEmergencyPlan.user_id == user_id
        )
    )

    return plan


@router.post(
    "",
    response_model=FamilyPlanResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_family_plan(
    data: FamilyPlanCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    existing_plan = db.scalar(
        select(FamilyEmergencyPlan).where(
            FamilyEmergencyPlan.user_id == user_id
        )
    )

    if existing_plan:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Family emergency plan already exists",
        )

    plan = FamilyEmergencyPlan(
        user_id=user_id,
        meeting_point=data.meeting_point,
        emergency_contact_name=data.emergency_contact_name,
        emergency_contact_phone=data.emergency_contact_phone,
    )

    db.add(plan)
    db.commit()
    db.refresh(plan)

    return plan


@router.put("", response_model=FamilyPlanResponse)
def update_family_plan(
    data: FamilyPlanCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    plan = db.scalar(
        select(FamilyEmergencyPlan).where(
            FamilyEmergencyPlan.user_id == user_id
        )
    )

    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Family emergency plan not found",
        )

    plan.meeting_point = data.meeting_point
    plan.emergency_contact_name = data.emergency_contact_name
    plan.emergency_contact_phone = data.emergency_contact_phone

    db.commit()
    db.refresh(plan)

    return plan