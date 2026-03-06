from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class AlertBase(BaseModel):
    symbol: str
    condition: str # ABOVE, BELOW
    target_price: float

class AlertCreate(AlertBase):
    pass

class AlertResponse(AlertBase):
    id: UUID
    is_active: bool

    class Config:
        orm_mode = True
