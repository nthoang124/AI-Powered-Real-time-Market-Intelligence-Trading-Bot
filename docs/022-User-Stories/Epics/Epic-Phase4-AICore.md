---
id: EPIC-004
type: epic
status: draft
project: AI-Trading-Bot
tags: [phase-4, ai, ml, sentiment, lstm, rl]
linked-to: [[Roadmap-AI-Trading-Bot]]
created: 2026-03-07
updated: 2026-03-07
---

# Epic: Phase 4 — AI Core Features

> Implements: [[PRD-AI-Trading-Bot]] | Timeline: **Tuần 9-12**

## Mục tiêu
Xây dựng 3 tính năng AI cốt lõi tích hợp trực tiếp vào FastAPI backend.

## Stories

### F4.1: Sentiment Analysis (PhoBERT)
- **Branch**: `feat/ai-sentiment-analysis`
- **Experiment branch**: `experiment/phobert-finetune`
- **Trạng thái**: ⬜ TODO
- **Tasks**:
  - [ ] News scraper (RSS feeds, social media)
  - [ ] `SentimentAnalyzer` class (PhoBERT)
  - [ ] Fine-tune trên financial dataset
  - [ ] API: GET `/api/ai/sentiment/{symbol}` (🔒 Premium)
  - [ ] Frontend: Sentiment gauge chart
- **Metrics**: Accuracy > 80% trên test set

### F4.2: Price Prediction (LSTM/GRU)
- **Branch**: `feat/ai-price-prediction`
- **Experiment branch**: `experiment/lstm-tuning`
- **Trạng thái**: ⬜ TODO
- **Tasks**:
  - [ ] Feature engineering (RSI, MACD, Bollinger, Volume)
  - [ ] `PricePredictionLSTM` model (PyTorch)
  - [ ] Training notebook + evaluate
  - [ ] API: GET `/api/ai/prediction/{symbol}` (🔒 Premium)
  - [ ] Frontend: Prediction overlay chart
- **Metrics**: Directional Accuracy > 55%, RMSE < 5%

### F4.3: AI Trading Signals (RL/PPO)
- **Branch**: `feat/ai-trading-signals`
- **Experiment branch**: `experiment/ppo-training`
- **Trạng thái**: ⬜ TODO
- **Tasks**:
  - [ ] `TradingEnvironment` (custom Gymnasium env)
  - [ ] PPO agent training (Stable Baselines3)
  - [ ] API: GET `/api/ai/signals/{symbol}` (🔒 Premium)
  - [ ] Frontend: Signal panel (BUY/SELL/HOLD)
- **Metrics**: Outperform random baseline by > 20%

## Quality Gate
- [ ] Sentiment analyzer trả về scores 0-100
- [ ] LSTM model train với acceptable RMSE
- [ ] RL agent outperform random strategy
- [ ] All AI endpoints trả về đúng JSON
- [ ] Premium gating hoạt động (403 cho FREE users)
