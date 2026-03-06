from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.portfolio import PortfolioResponse, OrderRequest, OrderResponse, HoldingResponse
from app.services.trading_service import TradingService
from app.services.market_service import MarketService
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=PortfolioResponse)
async def get_portfolio(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Get user's portfolio, balance, and holdings with current market value"""
    user_id = UUID(current_user['sub'])
    portfolio = await TradingService.get_or_create_portfolio(user_id, db)
    holdings = await TradingService.get_holdings(portfolio.id, db)
    
    # Calculate current values using MarketService
    symbols = [h.symbol for h in holdings]
    prices = await MarketService.get_current_prices(symbols)
    price_map = {p.symbol: p.price for p in prices}
    
    holding_responses = []
    total_value = portfolio.balance
    
    for h in holdings:
        current_price = price_map.get(h.symbol, h.avg_price)
        unrealized_pnl = (current_price - h.avg_price) * h.quantity
        holding_value = current_price * h.quantity
        
        total_value += holding_value
        
        holding_responses.append(HoldingResponse(
            symbol=h.symbol,
            quantity=h.quantity,
            avg_price=h.avg_price,
            current_price=current_price,
            unrealized_pnl=unrealized_pnl
        ))
        
    return PortfolioResponse(
        id=portfolio.id,
        balance=portfolio.balance,
        holdings=holding_responses,
        total_value=total_value
    )

@router.post("/trade", response_model=OrderResponse)
async def execute_trade(
    order: OrderRequest, 
    current_user: dict = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    """Execute a paper trade (BUY/SELL)"""
    try:
        user_id = UUID(current_user['sub'])
        return await TradingService.execute_trade(user_id, order, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
