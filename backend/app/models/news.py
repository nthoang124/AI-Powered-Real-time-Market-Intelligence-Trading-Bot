import uuid
from datetime import datetime
from sqlalchemy import String, Float, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"
    
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String, index=True)
    source: Mapped[str] = mapped_column(String)
    url: Mapped[str] = mapped_column(String, unique=True)
    published_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    content: Mapped[str] = mapped_column(Text)
    sentiment_score: Mapped[float] = mapped_column(Float, nullable=True) # 0-100 score
    sentiment_label: Mapped[str] = mapped_column(String, nullable=True) # Bullish, Bearish, Neutral
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
