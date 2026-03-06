from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.dependencies import get_current_user, require_premium
from app.models.user import User
from app.models.news import NewsArticle
from app.ai.sentiment.analyzer import SentimentAnalyzer

router = APIRouter()

# Lazy loading the model to prevent massive memory usage on startup if not needed
# In production, this should ideally be handled via lifespan events or Celery.
_sentiment_analyzer = None

def get_analyzer():
    global _sentiment_analyzer
    if _sentiment_analyzer is None:
        _sentiment_analyzer = SentimentAnalyzer()
    return _sentiment_analyzer

class ArticleSentiment(BaseModel):
    text: str
    positive: float
    neutral: float
    negative: float

class SentimentResponse(BaseModel):
    symbol: str
    market_sentiment: float
    label: str
    details: List[ArticleSentiment]

@router.get("/sentiment/{symbol}", response_model=SentimentResponse)
async def get_sentiment(
    symbol: str, 
    limit: int = 5,
    user: User = Depends(require_premium),
    db: AsyncSession = Depends(get_db)
):
    """
    Get AI-driven market sentiment for a specific symbol based on recent news.
    Requires Premium subscription.
    """
    # 1. Fetch recent news from DB
    stmt = select(NewsArticle).order_by(NewsArticle.published_at.desc()).limit(limit)
    result = await db.execute(stmt)
    articles = result.scalars().all()
    
    if not articles:
        return SentimentResponse(
            symbol=symbol,
            market_sentiment=50.0,
            label="Neutral",
            details=[]
        )
        
    # Filter articles roughly relevant to the crypto token (simplified for MVP)
    # E.g. symbol "BTCUSDT" -> search "Bitcoin" or "BTC"
    symbol_name = symbol.replace("USDT", "").lower()
    
    texts_to_analyze = [
        a.title for a in articles 
        if symbol_name in a.title.lower() or symbol_name in a.content.lower()
    ]
    
    # If no specific matches, fall back to general market sentiment
    if not texts_to_analyze:
        texts_to_analyze = [a.title for a in articles]
        
    # 2. Analyze with PhoBERT
    analyzer = get_analyzer()
    analysis = analyzer.analyze(texts_to_analyze)
    
    return SentimentResponse(
        symbol=symbol,
        market_sentiment=analysis["market_sentiment"],
        label=analysis["label"],
        details=[ArticleSentiment(**d) for d in analysis["details"]]
    )

from app.schemas.market import OHLCVResponse
from app.services.market_service import MarketService
from app.ai.prediction.lstm_model import PredictionService

_prediction_service = None

def get_prediction_service():
    global _prediction_service
    if _prediction_service is None:
        _prediction_service = PredictionService()
    return _prediction_service

class PredictionResponse(BaseModel):
    symbol: str
    current_price: float
    predicted_price: float
    direction: str
    change_pct: float
    horizon_minutes: int
    confidence: float

@router.get("/prediction/{symbol}", response_model=PredictionResponse)
async def get_price_prediction(
    symbol: str,
    user: User = Depends(require_premium)
):
    """
    Get AI-driven price prediction using Deep Learning (LSTM).
    Requires Premium subscription.
    """
    # 1. Fetch recent OHLCV data to build the sliding window
    # We need at least 60-100 candles for the window and technical indicators
    ohlcv_data = await MarketService.get_ohlcv(symbol, interval="15m", limit=100)
    
    if not ohlcv_data:
        raise HTTPException(status_code=400, detail="Not enough market data for prediction")
        
    data_dicts = [
        {
            "open": d.open,
            "high": d.high,
            "low": d.low,
            "close": d.close,
            "volume": d.volume,
            "symbol": symbol
        }
        for d in ohlcv_data
    ]
    
    # 2. Predict using LSTM
    pred_service = get_prediction_service()
    prediction = pred_service.predict(data_dicts, horizon=30)
    
    return PredictionResponse(**prediction)

from app.ai.trading.rl_agent import TradingSignalBot

_trading_bot = None

def get_trading_bot():
    global _trading_bot
    if _trading_bot is None:
        _trading_bot = TradingSignalBot()
    return _trading_bot

class SignalResponse(BaseModel):
    symbol: str
    signal: str
    confidence: float
    reasoning: str

@router.get("/signals/{symbol}", response_model=SignalResponse)
async def get_trading_signal(
    symbol: str,
    user: User = Depends(require_premium)
):
    """
    Get AI-driven trading signal (BUY/SELL/HOLD) from the Reinforcement Learning agent.
    Requires Premium subscription.
    """
    # 1. Fetch recent OHLCV data
    # We need candles to calculate indicators for the state vector
    ohlcv_data = await MarketService.get_ohlcv(symbol, interval="15m", limit=30)
    
    if not ohlcv_data:
        raise HTTPException(status_code=400, detail="Not enough market data for signaling")
        
    data_dicts = [
        {
            "open": d.open,
            "high": d.high,
            "low": d.low,
            "close": d.close,
            "volume": d.volume,
            "symbol": symbol
        }
        for d in ohlcv_data
    ]
    
    bot = get_trading_bot()
    signal_data = bot.get_signal(data_dicts)
    
    return SignalResponse(**signal_data)
