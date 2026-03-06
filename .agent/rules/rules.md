# AI-Powered Real-time Market Intelligence & Trading Bot — Project Rules

## 📋 Project Overview
- **Project name:** AI Trading Bot
- **Frontend:** Next.js 14+ (App Router), TypeScript, TailwindCSS
- **Backend:** Python 3.12+, FastAPI, SQLAlchemy 2.0 (async), Pydantic v2
- **AI/ML:** PyTorch, Hugging Face Transformers, Stable Baselines3
- **Database:** PostgreSQL + TimescaleDB + Redis
- **Streaming:** Apache Kafka, python-socketio (WebSocket)
- **Task Queue:** Celery + Redis
- **Auth:** JWT (python-jose) + bcrypt (passlib)
- **Payment:** Stripe (stripe-python)

---

## 🐍 Python Backend Rules

### General
- Python 3.12+ required. Use modern features (match/case, type hints, f-strings).
- Always use `async/await` for I/O-bound operations (database, HTTP, Redis, Kafka).
- Follow PEP 8. Use `ruff` for linting and formatting.
- All functions and classes must have type hints and docstrings.
- Never use `print()` for logging — use `loguru` or `logging` module.

### FastAPI
- Use Pydantic v2 models for ALL request/response schemas. No raw dicts.
- Use `Depends()` for dependency injection (database sessions, auth, services).
- Group endpoints by domain into separate routers (`app/api/*.py`).
- Use `lifespan` context manager for startup/shutdown (loading ML models, connections).
- Return proper HTTP status codes (201 for creation, 404 for not found, etc.).
- Use `HTTPException` with clear `detail` messages.
- Enable automatic OpenAPI docs (`/docs` and `/redoc`).

### SQLAlchemy & Database
- Use SQLAlchemy 2.0 style with `Mapped[]` and `mapped_column()`.
- Use `async_sessionmaker` with `AsyncSession`. Never use sync sessions.
- Use Alembic for ALL schema changes — never modify DB manually.
- Always use database transactions for multi-step operations.
- Index frequently queried columns (email, symbol, user_id).
- Use TimescaleDB hypertables for all time-series market data.

### Security
- Hash passwords with bcrypt via `passlib`. Never store plain-text passwords.
- JWT tokens expire in 30 minutes. Use refresh tokens for long sessions.
- Use `require_premium` dependency for AI/premium endpoints.
- Validate all user inputs with Pydantic. Never trust client data.
- Use parameterized queries — never string-concatenate SQL.
- Store secrets in `.env` file. Never commit secrets to git.

### AI/ML
- Load ML models ONCE at startup via FastAPI `lifespan`, store on `app.state`.
- Use `torch.no_grad()` for ALL inference operations.
- Run heavy ML tasks (batch sentiment, report generation) via Celery workers.
- Save trained model weights in `backend/trained_models/`.
- Use `pandas-ta` or `TA-Lib` for technical indicators (RSI, MACD, Bollinger).

### Testing
- Use `pytest` + `pytest-asyncio` for all tests.
- Use `httpx.AsyncClient` with `ASGITransport` for API tests.
- Minimum 80% test coverage for services and API endpoints.
- Test both happy paths and error cases (400, 401, 403, 404).

---

## ⚛️ Frontend Rules (Next.js)

### General
- Use Next.js 14+ App Router exclusively. No Pages Router.
- TypeScript strict mode enabled. No `any` types.
- Use TailwindCSS for styling. Follow utility-first approach.
- Components must be in `src/components/` organized by domain.

### State Management
- Use Zustand for global client state (portfolio, user, theme).
- Use React Query (TanStack) for server state (API data fetching, caching).
- Use Socket.IO client for real-time WebSocket data.

### Performance
- Use `'use client'` only when necessary (event handlers, hooks, browser APIs).
- Prefer Server Components by default.
- Use `next/dynamic` for heavy components (charts, heatmap).
- Use `React.memo()` for expensive list items.
- Use `Suspense` boundaries for loading states.

### UI/UX
- Dark theme by default (trading app convention).
- Color coding: Green (`#22c55e`) = positive/buy, Red (`#ef4444`) = negative/sell.
- Use Lightweight Charts (TradingView) for all financial charts.
- Use D3.js for heatmap visualization.
- All interactive elements must have unique IDs for testing.
- Responsive design: support desktop (1920px) → tablet (768px).

---

## 🏗️ Architecture Rules

### File Naming
- Python: `snake_case.py` (e.g., `trading_service.py`, `lstm_model.py`)
- TypeScript: `PascalCase.tsx` for components, `camelCase.ts` for utils
- Schemas/Models: singular nouns (`user.py`, `trade.py`, not `users.py`)

### API Design
- REST endpoints: `/api/{domain}/{resource}` (e.g., `/api/market/prices`)
- Use path parameters for identifiers: `/api/ai/sentiment/{symbol}`
- Use query parameters for filters: `/api/screener?min_pe=10&max_pe=30`
- WebSocket namespace: `ws://host:8000` with rooms per symbol (`market:BTCUSDT`)

### Error Handling
- Backend: Always use structured error responses `{"detail": "message"}`.
- Frontend: Show user-friendly error messages. Log technical details to console.
- Never expose stack traces or internal errors to the client.

### Git Conventions
- Branch naming: `feature/xxx`, `fix/xxx`, `hotfix/xxx`
- Commit messages: `type(scope): description` (e.g., `feat(trading): add paper trading engine`)
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`

---

## 🚫 Don'ts
- Don't use synchronous database operations in FastAPI.
- Don't store ML models in git — use `.gitignore` for `trained_models/*.pth`.
- Don't hardcode API keys, prices, or configuration values.
- Don't create new database tables without an Alembic migration.
- Don't bypass authentication on any endpoint except `/api/auth/*` and `/docs`.
- Don't use `*` imports in Python.
- Don't commit `.env` files or any secrets.
