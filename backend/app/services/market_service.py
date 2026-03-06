from typing import List
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.schemas.market import PriceResponse, OHLCVResponse, HeatmapResponse
import logging

logger = logging.getLogger(__name__)

class MarketService:
    @staticmethod
    async def get_current_prices(symbols: List[str]) -> List[PriceResponse]:
        # Typically fetches from Redis cache updated by the WebSocket/Kafka pipeline
        # Here we use Binance API as a fallback
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get('https://api.binance.com/api/v3/ticker/price')
                data = response.json()
                symbols_set = set([s.upper() for s in symbols])
                result = []
                for item in data:
                    if item['symbol'] in symbols_set:
                        result.append(PriceResponse(
                            symbol=item['symbol'],
                            price=float(item['price']),
                            volume=0.0,
                            timestamp=0
                        ))
                return result
            except Exception as e:
                logger.error(f"Error fetching current prices: {e}")
                return []

    @staticmethod
    async def get_ohlcv(symbol: str, interval: str, limit: int, db: AsyncSession) -> List[OHLCVResponse]:
        # PostgreSQL doesn't have native time-bucketing like TimescaleDB, 
        # so for this phase we just return the raw latest close values mapped as candles.
        # To strictly do OHLCV in standard PG, one would write a 'date_trunc' GROUP BY query.
        try:
            result = await db.execute(text(
                "SELECT time, open, high, low, close, volume FROM market_prices "
                "WHERE symbol = :symbol ORDER BY time DESC LIMIT :limit"
            ), {"symbol": symbol.upper(), "limit": limit})
            
            rows = result.fetchall()
            return [
                OHLCVResponse(
                    time=row.time,
                    open=row.open or row.close,
                    high=row.high or row.close,
                    low=row.low or row.close,
                    close=row.close,
                    volume=row.volume or 0.0
                ) for row in rows
            ]
        except Exception as e:
            logger.error(f"Error fetching OHLCV from DB: {e}")
            return []

    @staticmethod
    async def get_orderbook(symbol: str, limit: int) -> dict:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f'https://api.binance.com/api/v3/depth?symbol={symbol.upper()}&limit={limit}'
                )
                return response.json()
            except Exception as e:
                logger.error(f"Error fetching Orderbook: {e}")
                return {"bids": [], "asks": []}
                
    @staticmethod
    async def get_heatmap() -> HeatmapResponse:
        # Placeholder for Heatmap functionality
        return HeatmapResponse(items=[])
