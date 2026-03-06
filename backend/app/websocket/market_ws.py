import socketio
import json
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*" 
    # Important: In production, configure exact origins
)

@sio.event
async def connect(sid, environ):
    logger.info(f"Client connected to WebSocket: {sid}")

@sio.event
async def subscribe(sid, symbols: list[str]):
    """Client subscribes to a specific symbol for real-time price updates"""
    for symbol in symbols:
        room_name = f"market:{symbol.upper()}"
        await sio.enter_room(sid, room_name)
        logger.info(f"Client {sid} subscribed to {room_name}")
    await sio.emit('subscribed', {'symbols': symbols}, to=sid)

@sio.event
async def unsubscribe(sid, symbols: list[str]):
    """Client unsubscribes from symbols"""
    for symbol in symbols:
        room_name = f"market:{symbol.upper()}"
        await sio.leave_room(sid, room_name)
    await sio.emit('unsubscribed', {'symbols': symbols}, to=sid)

@sio.event
async def disconnect(sid):
    logger.info(f"Client disconnected: {sid}")

async def redis_listener():
    """Background task to listen to Redis and broadcast to Websockets"""
    import redis.asyncio as redis
    from async_timeout import timeout
    
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=False)
    pubsub = redis_client.pubsub()
    await pubsub.subscribe('market-updates')
    
    logger.info("WebSocket Redis listener started...")
    
    try:
        while True:
            # Handle messages from redis pub/sub
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message is not None:
                data = json.loads(message['data'].decode('utf-8'))
                symbol = data['symbol']
                
                # Broadcast the price update to any clients in the specific symbol room
                room = f"market:{symbol.upper()}"
                await sio.emit('price-update', data, room=room)
    except Exception as e:
        logger.error(f"Error in Redis listener: {e}")
    finally:
        await pubsub.unsubscribe('market-updates')
        await redis_client.aclose()
