from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ScreenerResult(BaseModel):
    symbol: str
    price: float
    change_24h: float
    volume_24h: float
    rsi_14: float
    macd: str # 'Bullish', 'Bearish', 'Neutral'
    signal: str # 'Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'

MOCK_SCREENER_DATA = [
    ScreenerResult(symbol="BTCUSDT", price=64200.50, change_24h=2.5, volume_24h=45000000.0, rsi_14=65.2, macd="Bullish", signal="Buy"),
    ScreenerResult(symbol="ETHUSDT", price=3450.20, change_24h=-1.2, volume_24h=18000000.0, rsi_14=48.5, macd="Neutral", signal="Hold"),
    ScreenerResult(symbol="SOLUSDT", price=145.80, change_24h=5.4, volume_24h=5200000.0, rsi_14=72.1, macd="Bullish", signal="Strong Buy"),
    ScreenerResult(symbol="ADAUSDT", price=0.45, change_24h=-2.0, volume_24h=800000.0, rsi_14=35.4, macd="Bearish", signal="Sell"),
    ScreenerResult(symbol="DOGEUSDT", price=0.15, change_24h=12.0, volume_24h=3100000.0, rsi_14=85.0, macd="Bullish", signal="Strong Buy"),
    ScreenerResult(symbol="XRPUSDT", price=0.55, change_24h=-0.1, volume_24h=1200000.0, rsi_14=45.2, macd="Bearish", signal="Hold"),
    ScreenerResult(symbol="LINKUSDT", price=18.20, change_24h=3.2, volume_24h=950000.0, rsi_14=58.7, macd="Bullish", signal="Buy"),
    ScreenerResult(symbol="UNIUSDT", price=7.80, change_24h=-4.5, volume_24h=420000.0, rsi_14=28.5, macd="Bearish", signal="Strong Sell"),
    ScreenerResult(symbol="DOTUSDT", price=7.10, change_24h=1.1, volume_24h=650000.0, rsi_14=52.0, macd="Neutral", signal="Hold"),
    ScreenerResult(symbol="AVAXUSDT", price=35.50, change_24h=4.2, volume_24h=1100000.0, rsi_14=68.5, macd="Bullish", signal="Buy")
]

@router.get("/", response_model=List[ScreenerResult])
async def get_screener_results(rsi_min: float = 0, rsi_max: float = 100):
    """Fetch actionable items matching screening criteria."""
    results = [item for item in MOCK_SCREENER_DATA if rsi_min <= item.rsi_14 <= rsi_max]
    return results
