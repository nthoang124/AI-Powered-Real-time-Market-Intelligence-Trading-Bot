import asyncio
import json
import logging
from aiokafka import AIOKafkaConsumer
import asyncpg
from datetime import datetime
import sys
import os

# Add parent dir to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def connect_to_db():
    try:
        pool = await asyncpg.create_pool(
            settings.DATABASE_URL,
            # Same fix as backend: pgBouncer in transaction mode does not support prepared statements
            server_settings={'statement_timeout': '10000'}
        )
        return pool
    except Exception as e:
        logger.error(f"Failed to connect to Supabase: {e}")
        raise

async def consume_market_data():
    consumer = AIOKafkaConsumer(
        'market-data',
        bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
        group_id='market-db-writer'
    )
    
    logger.info("Connecting to Database...")
    pool = await connect_to_db()
    logger.info("Connected to Supabase successfully.")

    import redis.asyncio as redis
    redis_client = redis.from_url(settings.REDIS_URL)

    await consumer.start()
    logger.info("Kafka consumer started listening to 'market-data'...")
    
    try:
        async for msg in consumer:
            data = json.loads(msg.value.decode())
            timestamp = datetime.fromtimestamp(data['timestamp'] / 1000.0)
            
            async with pool.acquire() as conn:
                try:
                    await conn.execute("""
                        INSERT INTO market_prices (time, symbol, close, volume)
                        VALUES ($1, $2, $3, $4)
                    """, timestamp, data['symbol'], data['price'], data['volume'])
                    
                    # Publish to Redis for WebSocket broadcast
                    await redis_client.publish(
                        'market-updates',
                        json.dumps(data)
                    )
                    logger.debug(f"Saved & Broadcasted: {data['symbol']} @ {data['price']}")
                except Exception as db_err:
                    logger.error(f"Error handling msg: {db_err}")
    finally:
        await consumer.stop()
        await pool.close()
        await redis_client.aclose()

if __name__ == "__main__":
    asyncio.run(consume_market_data())
