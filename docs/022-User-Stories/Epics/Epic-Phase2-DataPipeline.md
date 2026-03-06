---
id: EPIC-002
type: epic
status: draft
project: AI-Trading-Bot
tags: [phase-2, data-pipeline, kafka, websocket]
linked-to: [[Roadmap-AI-Trading-Bot]]
created: 2026-03-07
updated: 2026-03-07
---

# Epic: Phase 2 — Market Data Pipeline

> Implements: [[PRD-AI-Trading-Bot]] | Timeline: **Tuần 3-4**

## Mục tiêu
Thu thập dữ liệu thị trường real-time từ Binance/Yahoo Finance qua Kafka, lưu TimescaleDB, phát qua WebSocket.

## Stories

### F2.1: Kafka Pipeline (Producers)
- **Branch**: `feat/kafka-pipeline`
- **Trạng thái**: ⬜ TODO
- **Dependencies**: F1.2 (Kafka Docker)
- **Tasks**:
  - [ ] Binance WebSocket → Kafka producer
  - [ ] Yahoo Finance → Kafka producer
  - [ ] News RSS → Kafka producer
  - [ ] Error handling & reconnection
- **Commits dự kiến**:
  - `feat: tạo binance websocket producer`
  - `feat: tạo yahoo finance producer`
  - `feat: tạo news rss producer`
  - `fix: thêm reconnection logic`

### F2.2: WebSocket Server
- **Branch**: `feat/websocket-server`
- **Trạng thái**: ⬜ TODO
- **Dependencies**: F1.1 (FastAPI app)
- **Tasks**:
  - [ ] python-socketio AsyncServer setup
  - [ ] Subscribe/unsubscribe rooms per symbol
  - [ ] Broadcast price updates
  - [ ] Mount trên FastAPI ASGI app
- **Commits dự kiến**:
  - `feat: tạo socket.io async server`
  - `feat: thêm subscribe/broadcast rooms`
  - `feat: mount socketio trên fastapi`

### F2.3: TimescaleDB + Consumers
- **Branch**: `feat/timescaledb-setup`
- **Trạng thái**: ⬜ TODO
- **Dependencies**: F2.1 (Kafka producers chạy trước)
- **Tasks**:
  - [ ] Tạo hypertable `market_prices`
  - [ ] Continuous aggregate OHLCV 1h, 4h, 1d
  - [ ] Kafka consumer → TimescaleDB writer
  - [ ] Redis Pub/Sub bridge → WebSocket
- **Commits dự kiến**:
  - `feat: tạo market_prices hypertable`
  - `feat: thêm ohlcv continuous aggregate`
  - `feat: tạo kafka consumer → timescaledb`
  - `feat: thêm redis pubsub → websocket bridge`

## Quality Gate
- [ ] Kafka producer streams data từ Binance
- [ ] TimescaleDB nhận và lưu trữ price data
- [ ] WebSocket broadcasts price updates
- [ ] API `/market/prices` trả về dữ liệu đúng
