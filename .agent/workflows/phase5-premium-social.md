---
description: Implement Stripe payments, leaderboard rankings, copy trade, and multi-platform asset management
---

# Phase 5: Premium & Social Features

## Step 1: Stripe Payment Integration
- Install: `pip install stripe`
- Create `backend/app/api/subscription.py`
- POST `/api/subscription/checkout` — create Stripe Checkout Session
- POST `/api/subscription/webhook` — handle Stripe events
- On successful payment: update user role to PREMIUM
- Frontend: Pricing page with plan comparison
- Read `@stripe-integration` skill for best practices

## Step 2: Leaderboard (Feature #11)
- Backend: GET `/api/leaderboard`
- Calculate ROI = (portfolio_value - 100000) / 100000 * 100
- Rank by: ROI, Win Rate, Sharpe Ratio
- Show top 50 traders
- Frontend: Leaderboard table with ranking, avatar, stats

## Step 3: Copy Trade (Feature #12)
- Backend: `backend/app/api/copy_trade.py`
- POST `/api/copy-trade/follow/{user_id}` — follow a trader
- GET `/api/copy-trade/following` — list followed traders
- When followed trader executes trade → mirror in follower's portfolio
- Use Celery task for async trade mirroring

## Step 4: Multi-Platform Asset (Feature #13)
- Backend: `backend/app/services/exchange_connector.py`
- Connect to multiple exchange APIs (Binance, Coinbase, etc.)
- Aggregate portfolio data from multiple sources
- Frontend: Unified portfolio view across exchanges

## Step 5: Auto Analysis Report (Feature #14)
- Celery scheduled task: run daily at market close
- Generate report: top movers, sentiment summary, AI predictions
- Save as PDF or display in dashboard
- Frontend: Report viewer with date selector

## Quality Gate
- [ ] Stripe checkout flow works (test mode)
- [ ] User role updates to PREMIUM after payment
- [ ] Leaderboard shows correct rankings
- [ ] Copy trade mirrors trades correctly
- [ ] Daily reports generate without errors
