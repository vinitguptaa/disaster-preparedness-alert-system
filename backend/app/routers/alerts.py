from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user_id
from app.models import Alert, AlertSubscription
from app.schemas.alert import (
    AlertListResponse, AlertResponse, SubscriptionCreate, SubscriptionResponse, SubscriptionUpdate,
)

router = APIRouter(prefix="/api", tags=["Alerts"])


@router.get("/alerts", response_model=AlertListResponse)
def list_alerts(
    severity: str | None = Query(default=None, pattern="^(minor|moderate|severe|extreme)$"),
    limit: int = Query(default=25, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    filters = [Alert.status == "active", Alert.expires_at > now]
    if severity:
        filters.append(Alert.severity == severity)

    query = select(Alert).where(*filters).order_by(Alert.effective_at.desc())
    items = db.scalars(query.offset(offset).limit(limit)).all()
    total = db.scalar(select(func.count(Alert.id)).where(*filters)) or 0
    return AlertListResponse(items=items, total=total)


@router.get("/alerts/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.get(Alert, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.get("/alert-subscriptions", response_model=list[SubscriptionResponse])
def list_subscriptions(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return db.scalars(
        select(AlertSubscription)
        .where(AlertSubscription.user_id == user_id)
        .order_by(AlertSubscription.created_at.desc())
    ).all()


@router.post("/alert-subscriptions", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
def create_subscription(
    data: SubscriptionCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    subscription = AlertSubscription(user_id=user_id, **data.model_dump())
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


@router.patch("/alert-subscriptions/{subscription_id}", response_model=SubscriptionResponse)
def update_subscription(
    subscription_id: int,
    data: SubscriptionUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    subscription = db.scalar(select(AlertSubscription).where(
        AlertSubscription.id == subscription_id, AlertSubscription.user_id == user_id
    ))
    if not subscription:
        raise HTTPException(status_code=404, detail="Alert subscription not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(subscription, field, value)
    db.commit()
    db.refresh(subscription)
    return subscription


@router.delete("/alert-subscriptions/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subscription(
    subscription_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    subscription = db.scalar(select(AlertSubscription).where(
        AlertSubscription.id == subscription_id, AlertSubscription.user_id == user_id
    ))
    if not subscription:
        raise HTTPException(status_code=404, detail="Alert subscription not found")
    db.delete(subscription)
    db.commit()
