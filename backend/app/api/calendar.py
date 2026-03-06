from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta

router = APIRouter()

class EconomicEvent(BaseModel):
    id: str
    event: str
    country: str
    date: datetime
    impact: str # 'high', 'medium', 'low'
    actual: str | None = None
    forecast: str | None = None
    previous: str | None = None

MOCK_EVENTS = [
    EconomicEvent(
        id="evt-1",
        event="Core CPI (MoM)",
        country="US",
        date=datetime.utcnow() + timedelta(days=2),
        impact="high",
        forecast="0.3%",
        previous="0.2%"
    ),
    EconomicEvent(
        id="evt-2",
        event="Initial Jobless Claims",
        country="US",
        date=datetime.utcnow() + timedelta(days=3),
        impact="medium",
        forecast="210K",
        previous="212K"
    ),
    EconomicEvent(
        id="evt-3",
        event="Fed Interest Rate Decision",
        country="US",
        date=datetime.utcnow() + timedelta(days=10),
        impact="high",
        forecast="5.25%",
        previous="5.50%"
    ),
    EconomicEvent(
        id="evt-4",
        event="ECB Monetary Policy Statement",
        country="EU",
        date=datetime.utcnow() + timedelta(days=12),
        impact="high",
        forecast="",
        previous=""
    ),
    EconomicEvent(
        id="evt-5",
        event="Non-Farm Payrolls",
        country="US",
        date=datetime.utcnow() + timedelta(days=15),
        impact="high",
        forecast="180K",
        previous="175K"
    )
]

@router.get("/", response_model=List[EconomicEvent])
async def get_economic_calendar(limit: int = 10):
    """Fetch upcoming macro economic events."""
    return MOCK_EVENTS[:limit]
