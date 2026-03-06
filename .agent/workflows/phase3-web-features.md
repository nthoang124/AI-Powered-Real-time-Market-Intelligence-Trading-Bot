---
description: Build 15 web features - dashboard, portfolio, trading, screener, charts, alerts, news
---

# Phase 3: Core Web Features

## Step 1: Build Dashboard Layout (Frontend)
- Create dark-themed layout with sidebar navigation
- Pages: Dashboard, Portfolio, Trading, Screener, Leaderboard, Calendar, Settings
- Use TailwindCSS dark mode classes
- Read `@ui-ux-pro-max` and `@frontend-design` skills for premium design

## Step 2: Real-time Price Table (Feature #1)
- Frontend: `PriceTable.tsx` component with Socket.IO hook
- Backend: WebSocket price broadcast (from Phase 2)
- Show: Symbol, Price (color-coded), 24h Change, Volume
- Auto-update without page refresh

## Step 3: TradingView Charts (Feature #6)
- Install `lightweight-charts` in frontend
- Create `TradingChart.tsx` component with candlestick series
- Fetch OHLCV data from `/api/market/ohlcv/{symbol}`
- Add RSI, MACD indicators overlay
- Dark theme matching dashboard

## Step 4: Market Heatmap (Feature #2)
- Use D3.js treemap for sector heatmap
- Color: green (up) → red (down) gradient
- Size: market cap proportional
- Create `Heatmap.tsx` component

## Step 5: Portfolio Management (Feature #3)
- Backend: CRUD endpoints in `backend/app/api/portfolio.py`
- Frontend: Portfolio dashboard showing holdings, P&L, allocation pie chart
- Calculate unrealized P&L from current market prices

## Step 6: Paper Trading Engine (Feature #10)
- Backend: `trading_service.py` with BUY/SELL logic
- Balance management, position tracking, avg price calculation
- Frontend: Trading panel with order form (Market/Limit)
- Transaction history table

## Step 7: Price Alerts (Feature #4)
- Backend: `alerts.py` — create/delete alerts (ABOVE/BELOW price)
- Celery task: check alerts periodically against current prices
- Send notification when triggered (WebSocket push)

## Step 8: Stock Screener (Feature #5)
- Backend: `screener.py` — filter by P/E, market cap, volume, sector
- Frontend: Filter panel + results table
- Sortable columns, pagination

## Step 9: Order Book (Feature #7)
- Fetch from exchange API (Binance)
- Frontend: Bid/Ask depth visualization
- Color-coded buy (green) / sell (red) bars

## Step 10: Economic Calendar (Feature #8)
- Fetch events from external API
- Frontend: Calendar view with event markers
- Filter by impact level (High/Medium/Low)

## Step 11: News Aggregator (Feature #9)
- Backend: `news.py` — aggregate from multiple RSS feeds
- Celery task: fetch news every 5 minutes
- Frontend: News feed with sentiment badge per article

## Step 12: Permission System (Feature #15)
- Backend: `require_premium` dependency guard
- Frontend: Show upgrade prompts for locked features
- Feature gates: AI features, Copy Trade, Advanced Screener

## Quality Gate
- [ ] Dashboard renders with real-time data
- [ ] TradingView charts display correctly
- [ ] Paper trading BUY/SELL works end-to-end
- [ ] Portfolio P&L updates with market prices
- [ ] Price alerts trigger notifications
- [ ] Screener filters return correct results
- [ ] FREE vs PREMIUM feature gates work
