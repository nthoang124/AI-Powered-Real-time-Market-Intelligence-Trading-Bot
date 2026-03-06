from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.models.portfolio import Portfolio, Holding, Trade
from app.schemas.portfolio import OrderRequest, OrderResponse
import logging

logger = logging.getLogger(__name__)

class TradingService:
    @staticmethod
    async def get_or_create_portfolio(user_id: UUID, db: AsyncSession) -> Portfolio:
        result = await db.execute(select(Portfolio).where(Portfolio.user_id == user_id))
        portfolio = result.scalar_one_or_none()
        if not portfolio:
            portfolio = Portfolio(user_id=user_id, balance=10000.0)
            db.add(portfolio)
            await db.commit()
            await db.refresh(portfolio)
        return portfolio

    @staticmethod
    async def get_holdings(portfolio_id: UUID, db: AsyncSession) -> list[Holding]:
        result = await db.execute(select(Holding).where(Holding.portfolio_id == portfolio_id))
        return result.scalars().all()

    @staticmethod
    async def execute_trade(user_id: UUID, order: OrderRequest, db: AsyncSession) -> OrderResponse:
        portfolio = await TradingService.get_or_create_portfolio(user_id, db)
        total_cost = order.quantity * order.price
        
        # In a generic situation, you'd calculate exact price from the market. 
        # Here we allow the client/order to specify execution price (from latest tick).

        if order.type.upper() == 'BUY':
            if portfolio.balance < total_cost:
                raise ValueError("Insufficient balance for this purchase.")
            
            # Deduct balance
            portfolio.balance -= total_cost
            
            # Update or create holding
            result = await db.execute(
                select(Holding).where(Holding.portfolio_id == portfolio.id, Holding.symbol == order.symbol.upper())
            )
            holding = result.scalar_one_or_none()
            
            if holding:
                # Calculate new average price
                total_value = (holding.quantity * holding.avg_price) + total_cost
                holding.quantity += order.quantity
                holding.avg_price = total_value / holding.quantity
            else:
                holding = Holding(
                    portfolio_id=portfolio.id,
                    symbol=order.symbol.upper(),
                    quantity=order.quantity,
                    avg_price=order.price
                )
                db.add(holding)
                
        elif order.type.upper() == 'SELL':
            result = await db.execute(
                select(Holding).where(Holding.portfolio_id == portfolio.id, Holding.symbol == order.symbol.upper())
            )
            holding = result.scalar_one_or_none()
            
            if not holding or holding.quantity < order.quantity:
                raise ValueError("Insufficient holding quantity for this sale.")
            
            # Add to balance
            portfolio.balance += total_cost
            
            # Reduce holding
            holding.quantity -= order.quantity
            if holding.quantity == 0:
                await db.delete(holding)
                
        else:
            raise ValueError("Invalid order type.")

        # Record trade
        trade = Trade(
            portfolio_id=portfolio.id,
            symbol=order.symbol.upper(),
            trade_type=order.type.upper(),
            quantity=order.quantity,
            price=order.price,
            total=total_cost
        )
        db.add(trade)
        
        await db.commit()
        await db.refresh(trade)
        
        return OrderResponse(
            status="FILLED",
            trade_id=trade.id,
            symbol=trade.symbol,
            type=trade.trade_type,
            quantity=trade.quantity,
            executed_price=trade.price
        )
