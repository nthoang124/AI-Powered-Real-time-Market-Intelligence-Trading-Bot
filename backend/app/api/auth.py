from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.core.database import get_db
from app.models.user import User
from app.core.config import settings
from pydantic import BaseModel

router = APIRouter()

class WebhookPayload(BaseModel):
    type: str
    record: dict
    old_record: Optional[dict] = None

@router.post("/webhook")
async def supabase_webhook(
    payload: WebhookPayload,
    request: Request,
    authorization: str = Header(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Webhook endpoint to sync users from Supabase Auth to our public.users table.
    Supabase will call this endpoint whenever a user registers or updates their profile.
    """
    # Simple webhook secret validation (configure this in Supabase Webhook settings)
    webhook_secret = getattr(settings, "SUPABASE_WEBHOOK_SECRET", None)
    if webhook_secret and authorization != f"Bearer {webhook_secret}":
        raise HTTPException(status_code=401, detail="Unauthorized webhook call")

    if payload.type == "INSERT":
        # New user registered in Supabase
        user_id = payload.record.get("id")
        email = payload.record.get("email")
        
        # Check if user already exists
        existing = await db.execute(select(User).where(User.id == user_id))
        if existing.scalar_one_or_none():
            return {"status": "User already synced"}

        # Extract name from raw_user_meta_data if available
        meta = payload.record.get("raw_user_meta_data", {})
        name = meta.get("full_name", meta.get("name", "Unknown"))
        
        # Create user in our DB (No hashed_password needed since Supabase handles it)
        try:
            new_user = User(
                id=user_id, # Link UUID with Supabase Auth UUID
                email=email,
                name=name,
                hashed_password="" # Not used
            )
            db.add(new_user)
            await db.commit()
            return {"status": "User synced successfully", "id": user_id}
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
            
    elif payload.type == "UPDATE":
        # Handle user updates if necessary
        return {"status": "Update processed"}
        
    elif payload.type == "DELETE":
        # Optional: Handle user deletion
        return {"status": "Delete processed"}

    return {"status": "Ignored"}
