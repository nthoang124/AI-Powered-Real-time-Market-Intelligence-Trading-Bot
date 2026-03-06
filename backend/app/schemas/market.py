from pydantic import BaseModel
from typing import List
from datetime import datetime

class PriceResponse(BaseModel):
    symbol: str
    price: float
    volume: float
    timestamp: int

class OHLCVResponse(BaseModel):
    time: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float

class HeatmapItem(BaseModel):
    symbol: str
    change_percent: float
    volume: float

class HeatmapResponse(BaseModel):
    items: List[HeatmapItem]
