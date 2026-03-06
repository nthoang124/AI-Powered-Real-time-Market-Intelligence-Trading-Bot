from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.alert import AlertResponse, AlertCreate
from app.services.alert_service import AlertService
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=list[AlertResponse])
async def get_alerts(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Get active alerts for the current user."""
    user_id = UUID(current_user['sub'])
    return await AlertService.get_alerts_by_user(user_id, db)

@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(
    alert: AlertCreate, 
    current_user: dict = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    """Create a new price alert."""
    user_id = UUID(current_user['sub'])
    if alert.condition.upper() not in ["ABOVE", "BELOW"]:
        raise HTTPException(status_code=400, detail="Condition must be 'ABOVE' or 'BELOW'.")
    return await AlertService.create_alert(user_id, alert, db)

@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_alert(
    alert_id: UUID, 
    current_user: dict = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    """Delete a price alert."""
    user_id = UUID(current_user['sub'])
    deleted = await AlertService.delete_alert(alert_id, user_id, db)
    if not deleted:
        raise HTTPException(status_code=404, detail="Alert not found.")
    return None
