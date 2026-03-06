from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.market import router as market_router
from app.api.portfolio import router as portfolio_router
from app.api.alerts import router as alerts_router
from app.api.news import router as news_router
from app.api.calendar import router as calendar_router
from app.api.screener import router as screener_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth")
api_router.include_router(market_router, prefix="/market")
api_router.include_router(portfolio_router, prefix="/portfolio")
api_router.include_router(alerts_router, prefix="/alerts")
api_router.include_router(news_router, prefix="/news")
api_router.include_router(calendar_router, prefix="/calendar")
api_router.include_router(screener_router, prefix="/screener")
