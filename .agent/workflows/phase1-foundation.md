---
description: Set up project foundation - Docker, database, FastAPI skeleton, authentication
---
// turbo-all

# Phase 1: Foundation & Infrastructure Setup

## Step 1: Create project directory structure
```bash
mkdir -p AI-Trading-Bot/frontend AI-Trading-Bot/backend/app/api AI-Trading-Bot/backend/app/models AI-Trading-Bot/backend/app/schemas AI-Trading-Bot/backend/app/services AI-Trading-Bot/backend/app/ai/sentiment AI-Trading-Bot/backend/app/ai/prediction AI-Trading-Bot/backend/app/ai/trading AI-Trading-Bot/backend/app/websocket AI-Trading-Bot/backend/app/kafka AI-Trading-Bot/backend/app/tasks AI-Trading-Bot/backend/app/core AI-Trading-Bot/backend/tests AI-Trading-Bot/backend/trained_models AI-Trading-Bot/backend/notebooks AI-Trading-Bot/data-pipeline/producers AI-Trading-Bot/data-pipeline/consumers
```

## Step 2: Initialize Next.js frontend
```bash
cd AI-Trading-Bot && npx -y create-next-app@latest frontend --typescript --tailwind --app --src-dir --eslint --no-import-alias
```

## Step 3: Create Python virtual environment and install dependencies
```bash
cd AI-Trading-Bot/backend && python -m venv venv && venv\Scripts\activate && pip install fastapi "uvicorn[standard]" "sqlalchemy[asyncio]" asyncpg alembic pydantic-settings "python-jose[cryptography]" "passlib[bcrypt]" python-socketio redis celery httpx stripe python-multipart loguru
```

## Step 4: Initialize Alembic for database migrations
```bash
cd AI-Trading-Bot/backend && alembic init alembic
```

## Step 5: Start Docker services (PostgreSQL, TimescaleDB, Redis, Kafka)
Create `docker-compose.dev.yml` at project root, then run:
```bash
cd AI-Trading-Bot && docker-compose -f docker-compose.dev.yml up -d
```

## Step 6: Create FastAPI app entry point
Create `backend/app/main.py` with CORS, lifespan, and router registration.
Read `@fastapi-pro` skill for best practices.

## Step 7: Create SQLAlchemy models
Create models in `backend/app/models/` for User, Portfolio, Holding, Trade, Alert.
Read `@python-pro` skill for modern SQLAlchemy 2.0 patterns.

## Step 8: Run first Alembic migration
```bash
cd AI-Trading-Bot/backend && alembic revision --autogenerate -m "initial_models" && alembic upgrade head
```

## Step 9: Implement JWT Authentication
Create `backend/app/core/security.py` and `backend/app/api/auth.py`.
Read `@auth-implementation-patterns` skill for JWT patterns.

## Step 10: Verify backend starts
```bash
cd AI-Trading-Bot/backend && uvicorn app.main:app --reload --port 8000
```
Open http://localhost:8000/docs to verify Swagger UI loads.

## Step 11: Verify frontend starts
```bash
cd AI-Trading-Bot/frontend && npm run dev
```
Open http://localhost:3000 to verify Next.js loads.

## Quality Gate
- [ ] Docker services running (postgres, timescaledb, redis)
- [ ] Backend starts without errors on port 8000
- [ ] Swagger UI accessible at /docs
- [ ] Auth endpoints work (register + login return JWT)
- [ ] Frontend starts on port 3000
- [ ] Alembic migrations applied successfully
