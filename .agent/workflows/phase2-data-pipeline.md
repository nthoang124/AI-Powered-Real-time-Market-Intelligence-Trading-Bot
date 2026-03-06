---
description: Set up Kafka data pipeline, WebSocket server, and TimescaleDB for real-time market data
---
// turbo-all

# Phase 2: Market Data Pipeline

## Step 1: Install data pipeline dependencies
```bash
cd AI-Trading-Bot/data-pipeline && python -m venv venv && venv\Scripts\activate && pip install aiokafka websockets asyncpg httpx
```

## Step 2: Create Binance WebSocket → Kafka producer
Create `data-pipeline/producers/binance_producer.py`:
- Connect to Binance WebSocket stream (multi-symbol)
- Parse trade data (symbol, price, volume, timestamp)
- Publish to Kafka topic `market-data`
- Handle reconnection on disconnect

## Step 3: Create Yahoo Finance producer (for stock data)
Create `data-pipeline/producers/yahoo_producer.py`:
- Use `httpx` to fetch stock data from Yahoo Finance API
- Publish OHLCV data to Kafka topic `market-data`
- Run on schedule (every 1 minute during market hours)

## Step 4: Create News producer
Create `data-pipeline/producers/news_producer.py`:
- Fetch from RSS feeds (financial news sources)
- Publish to Kafka topic `news-data`
- Run on schedule (every 5 minutes)

## Step 5: Set up TimescaleDB hypertable
Run the SQL setup:
```sql
CREATE TABLE market_prices (
    time TIMESTAMPTZ NOT NULL,
    symbol TEXT NOT NULL,
    open DOUBLE PRECISION,
    high DOUBLE PRECISION,
    low DOUBLE PRECISION,
    close DOUBLE PRECISION,
    volume DOUBLE PRECISION
);
SELECT create_hypertable('market_prices', 'time');
```

## Step 6: Create Kafka → TimescaleDB consumer
Create `data-pipeline/consumers/market_consumer.py`:
- Consume from `market-data` topic
- Insert into TimescaleDB `market_prices` hypertable
- Use batch inserts for performance

## Step 7: Set up WebSocket server in backend
Create `backend/app/websocket/market_ws.py`:
- Use `python-socketio` AsyncServer
- Handle `subscribe` event (client joins symbol rooms)
- `broadcast_price()` function to emit to rooms
- Mount on FastAPI app

## Step 8: Connect Kafka consumer → WebSocket broadcast
- Kafka consumer reads price updates
- Publishes to Redis Pub/Sub channel
- Backend subscribes to Redis → broadcasts via WebSocket

## Step 9: Create market API endpoints
Create `backend/app/api/market.py`:
- GET `/api/market/prices` — current prices
- GET `/api/market/ohlcv/{symbol}` — candlestick data from TimescaleDB
- GET `/api/market/orderbook/{symbol}` — order book from exchange

## Step 10: Verify pipeline end-to-end
```bash
# Terminal 1: Start Kafka producer
cd data-pipeline && python producers/binance_producer.py

# Terminal 2: Start Kafka consumer
cd data-pipeline && python consumers/market_consumer.py

# Terminal 3: Start backend
cd backend && uvicorn app.main:socket_app --reload --port 8000
```

## Quality Gate
- [ ] Kafka producer streams data from Binance
- [ ] TimescaleDB receives and stores price data
- [ ] WebSocket broadcasts price updates to connected clients
- [ ] `/api/market/prices` returns current prices
- [ ] `/api/market/ohlcv/{symbol}` returns candlestick data
