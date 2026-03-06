from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class HoldingResponse(BaseModel):
    symbol: str
    quantity: float
    avg_price: float
    current_price: Optional[float] = None
    unrealized_pnl: Optional[float] = None

class PortfolioResponse(BaseModel):
    id: UUID
    balance: float
    holdings: List[HoldingResponse]
    total_value: Optional[float] = None

class OrderRequest(BaseModel):
    symbol: str
    type: str # 'BUY' or 'SELL'
    quantity: float
    price: float # limit or market execution price

class OrderResponse(BaseModel):
    status: str
    trade_id: UUID
    symbol: str
    type: str
    quantity: float
    executed_price: float
