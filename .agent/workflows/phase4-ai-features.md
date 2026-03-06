---
description: Build AI features - Sentiment Analysis (PhoBERT), Price Prediction (LSTM), Trading Signal Bot (RL)
---

# Phase 4: AI Core Features

## Prerequisites
Install ML dependencies:
```bash
cd AI-Trading-Bot/backend && venv\Scripts\activate && pip install torch transformers stable-baselines3 gymnasium pandas-ta scikit-learn joblib
```

## Step 1: Sentiment Analysis — Data Collection
- Create news scraper (RSS feeds: VNExpress, CafeF, financial news)
- Create social media collector (Reddit r/stocks, forums)
- Store raw text in PostgreSQL `news_articles` table
- Celery task: run every 5 minutes

## Step 2: Sentiment Analysis — PhoBERT Model
- Create `backend/app/ai/sentiment/analyzer.py`
- Load `vinai/phobert-base-v2` model
- Fine-tune on financial sentiment dataset (positive/neutral/negative)
- Output: Market Sentiment Score (0-100)

## Step 3: Sentiment Analysis — API & Frontend
- Backend: GET `/api/ai/sentiment/{symbol}` (🔒 Premium)
- Frontend: Gauge chart showing sentiment score
- Show individual article sentiment breakdown

## Step 4: Price Prediction — Data Preparation
- Create `backend/app/ai/prediction/feature_engineer.py`
- Calculate technical indicators: RSI, MACD, Bollinger Bands, Volume
- Create sliding windows (60 time steps → predict next)
- Normalize features with MinMaxScaler

## Step 5: Price Prediction — LSTM Model Training
- Create `backend/notebooks/train_lstm.ipynb`
- Architecture: 2-layer LSTM → Dense → Output
- Train on 1-2 years of historical data
- Metrics: MAE, RMSE, Directional Accuracy
- Save best model to `trained_models/lstm_price.pth`

## Step 6: Price Prediction — Inference API
- Create `backend/app/ai/prediction/lstm_model.py`
- Load model at startup via `lifespan`
- Backend: GET `/api/ai/prediction/{symbol}` (🔒 Premium)
- Return: current price, predicted price, direction, confidence

## Step 7: RL Trading Bot — Environment
- Create `backend/app/ai/trading/environment.py`
- Custom Gymnasium environment for trading simulation
- State: [price, volume, RSI, MACD, signal, position, balance, PnL]
- Actions: HOLD (0), BUY (1), SELL (2)
- Reward: portfolio value change + risk penalty

## Step 8: RL Trading Bot — Training
- Create `backend/notebooks/train_rl_agent.ipynb`
- Use PPO algorithm from Stable Baselines3
- Train on historical data with the custom environment
- Evaluate on out-of-sample test data
- Save model to `trained_models/rl_trading_agent.zip`

## Step 9: RL Trading Bot — Signal API
- Create `backend/app/ai/trading/rl_agent.py`
- Backend: GET `/api/ai/signals/{symbol}` (🔒 Premium)
- Return: signal (BUY/SELL/HOLD), confidence %, indicators

## Step 10: Combined AI Dashboard
- Frontend: AI Insights panel on dashboard
- Show sentiment gauge, price prediction chart, trading signals
- Premium gate: blur/lock for FREE users

## Quality Gate
- [ ] Sentiment analyzer returns valid scores (0-100)
- [ ] LSTM model trains with acceptable RMSE
- [ ] RL agent outperforms random trading strategy
- [ ] All AI endpoints return correct JSON responses
- [ ] Premium gating works (403 for FREE users)
- [ ] AI dashboard displays all 3 features
