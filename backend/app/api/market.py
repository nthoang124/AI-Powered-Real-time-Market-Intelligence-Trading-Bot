from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.market_service import MarketService
from app.schemas.market import PriceResponse, OHLCVResponse, HeatmapResponse

router = APIRouter()

@router.get("/prices", response_model=list[PriceResponse])
async def get_prices(symbols: str = Query(default="BTCUSDT,ETHUSDT")):
    """Get current prices of multiple symbols via API"""
    symbol_list = symbols.split(",")
    return await MarketService.get_current_prices(symbol_list)

@router.get("/ohlcv/{symbol}", response_model=list[OHLCVResponse])
async def get_ohlcv(symbol: str, interval: str = "1h", limit: int = 100, db: AsyncSession = Depends(get_db)):
    """Get candlestick data for charting from Supabase DB"""
    return await MarketService.get_ohlcv(symbol, interval, limit, db)

@router.get("/orderbook/{symbol}")
async def get_orderbook(symbol: str, limit: int = 20):
    """Get live order book from exchange"""
    return await MarketService.get_orderbook(symbol, limit)

@router.get("/heatmap", response_model=HeatmapResponse)
async def get_heatmap():
    """Get market heatmap by sector"""
    return await MarketService.get_heatmap()
