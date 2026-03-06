from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.database import Base

class Portfolio(Base):
    __tablename__ = "portfolios"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    balance: Mapped[float] = mapped_column(Float, default=10000.0) # $10k initial paper money for MVP
    
class Holding(Base):
    __tablename__ = "holdings"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    portfolio_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("portfolios.id"))
    symbol: Mapped[str] = mapped_column(String, index=True)
    quantity: Mapped[float] = mapped_column(Float, default=0.0)
    avg_price: Mapped[float] = mapped_column(Float, default=0.0)

class Trade(Base):
    __tablename__ = "trades"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    portfolio_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("portfolios.id"))
    symbol: Mapped[str] = mapped_column(String, index=True)
    trade_type: Mapped[str] = mapped_column(String) # BUY, SELL
    quantity: Mapped[float] = mapped_column(Float)
    price: Mapped[float] = mapped_column(Float)
    total: Mapped[float] = mapped_column(Float)

class Alert(Base):
    __tablename__ = "alerts"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    symbol: Mapped[str] = mapped_column(String, index=True)
    condition: Mapped[str] = mapped_column(String) # ABOVE, BELOW
    target_price: Mapped[float] = mapped_column(Float)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
