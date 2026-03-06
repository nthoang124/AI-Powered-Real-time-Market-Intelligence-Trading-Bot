import asyncio
import json
import logging
from aiokafka import AIOKafkaProducer
import websockets

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def binance_stream():
    producer = AIOKafkaProducer(bootstrap_servers='localhost:9092')
    await producer.start()
    
    symbols = ["btcusdt", "ethusdt", "bnbusdt", "solusdt"]
    # Create the correct stream URL for multiple symbols
    streams = "/".join([f"{s}@trade" for s in symbols])
    uri = f"wss://stream.binance.com:9443/stream?streams={streams}"
    
    logger.info(f"Connecting to Binance Websocket: {uri}")
    try:
        async with websockets.connect(uri) as ws:
            logger.info("Successfully connected to Binance stream.")
            async for message in ws:
                data = json.loads(message)["data"]
                
                # Payload matching what our database expects
                payload = {
                    'symbol': data['s'],
                    'price': float(data['p']),
                    'volume': float(data['q']),
                    'timestamp': data['T']
                }
                
                await producer.send_and_wait(
                    'market-data',
                    key=data['s'].encode(),
                    value=json.dumps(payload).encode()
                )
                logger.debug(f"Produced: {payload}")
    except websockets.exceptions.ConnectionClosedError as e:
        logger.error(f"Binance WS connection closed: {e}. Reconnecting...")
    except Exception as e:
        logger.error(f"Error in binance stream: {e}")
    finally:
        await producer.stop()

if __name__ == "__main__":
    while True:
        try:
            asyncio.run(binance_stream())
        except KeyboardInterrupt:
            logger.info("Exiting...")
            break
        except Exception as e:
            logger.error(f"Restarting after error: {e}")
            import time
            time.sleep(5)
