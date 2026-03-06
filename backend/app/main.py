from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from loguru import logger
import asyncio
import socketio

from app.core.config import settings
from app.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Starting up AI Trading Bot backend...")
    
    # Start Redis listener as a background task for Websockets
    from app.websocket.market_ws import redis_listener
    listener_task = asyncio.create_task(redis_listener())
    app.state.redis_listener = listener_task
    logger.info("✅ Redis Pub/Sub WebSocket listener activated!")
    
    yield
    # Shutdown actions
    logger.info("Shutting down AI Trading Bot backend...")
    if hasattr(app.state, 'redis_listener'):
        app.state.redis_listener.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}

# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)

# Websocket Integration
from app.websocket.market_ws import sio
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)
