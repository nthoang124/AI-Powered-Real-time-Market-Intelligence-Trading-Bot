---
description: Testing, performance optimization, and Docker deployment for the AI Trading Bot
---

# Phase 6: Testing, Optimization & Deployment

## Step 1: Backend Unit Tests
```bash
cd AI-Trading-Bot/backend && pip install pytest pytest-asyncio httpx pytest-cov factory-boy
```

Write tests for:
- Auth: register, login, invalid credentials
- Trading: BUY/SELL, insufficient balance, invalid symbol
- Portfolio: CRUD, P&L calculation
- AI: sentiment endpoint, prediction endpoint, signal endpoint
- Permissions: FREE vs PREMIUM access

Run:
```bash
pytest tests/ -v --cov=app --cov-report=html
```

## Step 2: Frontend E2E Tests
```bash
cd AI-Trading-Bot/frontend && npx playwright install && npx playwright test
```

Test flows:
- Login → Dashboard → View prices
- Register → Paper trade → Check portfolio
- Navigate all pages without errors

## Step 3: Load Testing (WebSocket)
```bash
pip install locust
```
- Test WebSocket connections: 100, 500, 1000 concurrent clients
- Measure message latency and throughput
- Test API endpoints under load

## Step 4: Performance Optimization
- Add Redis caching for market data (TTL: 1 second)
- Add database indexes on frequently queried columns
- Use TimescaleDB continuous aggregates for OHLCV
- Optimize ML inference with ONNX Runtime (optional)
- Add connection pooling for PostgreSQL

## Step 5: Docker Production Build
Create Dockerfiles:
- `backend/Dockerfile` — multi-stage Python build
- `frontend/Dockerfile` — Next.js standalone build
- `docker-compose.prod.yml` — all services

```bash
cd AI-Trading-Bot && docker-compose -f docker-compose.prod.yml up --build
```

## Step 6: CI/CD Pipeline
Create `.github/workflows/ci.yml`:
- On push: lint (ruff), type check (mypy), test (pytest)
- On merge to main: build Docker images, deploy

## Step 7: Final Verification
- Run full test suite
- Manual testing of all 15 features
- Test AI features with real market data
- Verify Stripe payment flow
- Check WebSocket performance under load

## Quality Gate
- [ ] Backend tests pass with >80% coverage
- [ ] Frontend E2E tests pass
- [ ] WebSocket handles 500+ concurrent connections
- [ ] Docker production build works
- [ ] All 15 web features functional
- [ ] All 3 AI features return valid results
- [ ] Stripe payment flow works end-to-end
