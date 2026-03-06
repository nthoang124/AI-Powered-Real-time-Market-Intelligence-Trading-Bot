from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta

router = APIRouter()

class NewsArticle(BaseModel):
    id: str
    title: str
    source: str
    url: str
    published_at: datetime
    summary: str
    sentiment: str # 'bullish', 'bearish', 'neutral'

# Mock data for MVP
MOCK_NEWS = [
    NewsArticle(
        id="news-1",
        title="Bitcoin Surges Past Key Resistance Level on Institutional Buying",
        source="CoinDesk",
        url="#",
        published_at=datetime.utcnow() - timedelta(minutes=15),
        summary="Bitcoin's price rally accelerates as major institutions announce new crypto fund allocations.",
        sentiment="bullish"
    ),
    NewsArticle(
        id="news-2",
        title="SEC Delays Decision on Latest Ethereum ETF Application",
        source="CoinTelegraph",
        url="#",
        published_at=datetime.utcnow() - timedelta(hours=1),
        summary="The regulatory body has requested additional comments from the public before making a final ruling.",
        sentiment="bearish"
    ),
    NewsArticle(
        id="news-3",
        title="Solana Network Upgrades Focus on Validator Efficiency",
        source="The Block",
        url="#",
        published_at=datetime.utcnow() - timedelta(hours=3),
        summary="Developers implemented the latest patch aiming to decrease transaction latency under heavy load.",
        sentiment="neutral"
    ),
    NewsArticle(
        id="news-4",
        title="Federal Reserve Signals Slower Rate Cuts in 2025",
        source="Bloomberg Crypto",
        url="#",
        published_at=datetime.utcnow() - timedelta(hours=5),
        summary="Macroeconomic conditions may keep interest rates higher for longer, affecting risk assets including crypto.",
        sentiment="bearish"
    ),
    NewsArticle(
        id="news-5",
        title="Binance Announces Integration with New Layer-2 Network",
        source="CryptoSlate",
        url="#",
        published_at=datetime.utcnow() - timedelta(hours=8),
        summary="Users can now deposit and withdraw funds cheaper and faster using the newly supported Arbitrum Orbit chain.",
        sentiment="bullish"
    )
]

@router.get("/", response_model=List[NewsArticle])
async def get_latest_news(limit: int = 10):
    """Fetch aggregated crypto market news."""
    return MOCK_NEWS[:limit]
