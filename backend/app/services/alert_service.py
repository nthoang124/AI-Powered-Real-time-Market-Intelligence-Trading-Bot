from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.models.portfolio import Alert # Alert is stored in portfolio.py for MVP
from app.schemas.alert import AlertCreate

class AlertService:
    @staticmethod
    async def get_alerts_by_user(user_id: UUID, db: AsyncSession) -> list[Alert]:
        result = await db.execute(select(Alert).where(Alert.user_id == user_id, Alert.is_active == True))
        return list(result.scalars().all())

    @staticmethod
    async def create_alert(user_id: UUID, alert_data: AlertCreate, db: AsyncSession) -> Alert:
        alert = Alert(
            user_id=user_id,
            symbol=alert_data.symbol.upper(),
            condition=alert_data.condition.upper(),
            target_price=alert_data.target_price,
            is_active=True
        )
        db.add(alert)
        await db.commit()
        await db.refresh(alert)
        return alert

    @staticmethod
    async def delete_alert(alert_id: UUID, user_id: UUID, db: AsyncSession) -> bool:
        result = await db.execute(select(Alert).where(Alert.id == alert_id, Alert.user_id == user_id))
        alert = result.scalar_one_or_none()
        if alert:
            await db.delete(alert)
            await db.commit()
            return True
        return False
