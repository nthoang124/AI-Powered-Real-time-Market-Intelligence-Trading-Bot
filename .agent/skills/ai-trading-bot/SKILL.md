---
name: ai-trading-bot
description: "Project-specific skill for the AI-Powered Real-time Market Intelligence & Trading Bot. Defines tech stack, patterns, and conventions for the entire project."
risk: none
source: self
date_added: "2026-03-07"
---

# AI Trading Bot — Project Skill

## Overview
This skill provides context and conventions for the AI Trading Bot project. It should be loaded when working on any part of this project.

## Tech Stack Reference

### Backend (Python)
- **FastAPI** — async REST API + WebSocket (`python-socketio`)
- **SQLAlchemy 2.0** — async ORM with `Mapped[]` types
- **Alembic** — database migrations
- **Pydantic v2** — request/response schemas
- **Celery** — background tasks (news fetching, report generation, alert checking)
- **Redis** — cache, pub/sub, Celery broker
- **Kafka** — market data streaming pipeline
- **PostgreSQL** — relational data (users, portfolio, trades)
- **TimescaleDB** — time-series market prices

### Frontend (TypeScript)
- **Next.js 14+ App Router** — pages and server components
- **TailwindCSS** — utility-first styling, dark theme
- **Lightweight Charts** — TradingView financial charts
- **D3.js** — market heatmap
- **Socket.IO Client** — real-time price updates
- **Zustand** — global state
- **React Query** — server state / API caching

### AI/ML (integrated in backend)
- **PyTorch** — LSTM model for price prediction
- **Hugging Face Transformers** — PhoBERT for Vietnamese sentiment
- **Stable Baselines3** — PPO agent for trading signals
- **pandas-ta** — technical indicators (RSI, MACD, Bollinger)

## Key Patterns

### API Structure
```
backend/app/
├── api/           # FastAPI routers (one per domain)
├── models/        # SQLAlchemy ORM models
├── schemas/       # Pydantic request/response models
├── services/      # Business logic layer
├── ai/            # ML models (sentiment, prediction, trading)
├── websocket/     # Socket.IO handlers
├── kafka/         # Kafka producer/consumer
├── tasks/         # Celery background tasks
└── core/          # Security, permissions, exceptions
```

### Auth Pattern
```python
# Protect any endpoint:
@router.get("/data")
async def get_data(user: User = Depends(get_current_user)): ...

# Premium-only:
@router.get("/ai-feature")
async def ai_feature(user: User = Depends(require_premium)): ...
```

### Database Query Pattern
```python
async def get_portfolio(user_id: str, db: AsyncSession):
    result = await db.execute(select(Portfolio).where(Portfolio.user_id == user_id))
    return result.scalar_one_or_none()
```

### WebSocket Pattern
```python
# Broadcast to symbol subscribers
await sio.emit('price-update', data, room=f"market:{symbol}")
```

## Related Skills to Use
- `@fastapi-pro` — FastAPI best practices and advanced patterns
- `@python-pro` — Modern Python patterns, async, typing
- `@react-best-practices` — React/Next.js performance optimization
- `@nextjs-best-practices` — Next.js App Router patterns
- `@ui-ux-pro-max` — Premium UI/UX design
- `@frontend-design` — Frontend design system
- `@docker-expert` — Docker containerization
- `@auth-implementation-patterns` — JWT/OAuth2 patterns
- `@postgresql-optimization` — Database performance
- `@stripe-integration` — Stripe payment integration
- `@ai-agent-development` — AI agent architecture
- `@test-driven-development` — TDD workflow
- `@python-testing-patterns` — Pytest patterns
- `@playwright-skill` — E2E browser testing

## Workflows Available
Use slash commands to execute project workflows:
- `/phase1-foundation` — Docker, database, FastAPI skeleton, auth
- `/phase2-data-pipeline` — Kafka, WebSocket, TimescaleDB
- `/phase3-web-features` — All 15 web features
- `/phase4-ai-features` — Sentiment, LSTM, RL Agent
- `/phase5-premium-social` — Stripe, leaderboard, copy trade
- `/phase6-testing-deploy` — Testing, optimization, deployment
