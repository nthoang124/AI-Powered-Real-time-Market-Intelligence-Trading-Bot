---
id: ROADMAP-001
type: roadmap
status: draft
project: AI-Trading-Bot
tags: [roadmap, git-flow, phases, features]
created: 2026-03-07
---

# Roadmap — AI Trading Bot

## Tổng quan

Lộ trình phát triển **18 tính năng** (15 Web + 3 AI) theo mô hình **Git Flow**. Mỗi tính năng = 1 nhánh `feat/` riêng biệt, commit liên tục, merge vào `develop` khi hoàn thành.

---

## Branching Model

```
main ─────────────────────────────────────────────── (production)
  │
  └── develop ────────────────────────────────────── (integration)
        │
        ├── feat/project-setup          Phase 1 (Foundation)
        ├── feat/docker-infrastructure
        ├── feat/database-schema
        ├── feat/jwt-authentication
        │
        ├── feat/kafka-pipeline          Phase 2 (Data Pipeline)
        ├── feat/websocket-server
        ├── feat/timescaledb-setup
        │
        ├── feat/realtime-price-table    Phase 3 (Web Features)
        ├── feat/trading-charts
        ├── feat/market-heatmap
        ├── feat/portfolio-management
        ├── feat/paper-trading
        ├── feat/price-alerts
        ├── feat/stock-screener
        ├── feat/order-book
        ├── feat/news-aggregator
        ├── feat/economic-calendar
        ├── feat/permission-system
        │
        ├── feat/ai-sentiment-analysis   Phase 4 (AI Core)
        │    └── experiment/phobert-finetune
        ├── feat/ai-price-prediction
        │    └── experiment/lstm-tuning
        ├── feat/ai-trading-signals
        │    └── experiment/ppo-training
        │
        ├── feat/stripe-premium          Phase 5 (Premium & Social)
        ├── feat/leaderboard
        ├── feat/copy-trade
        ├── feat/multi-platform-assets
        ├── feat/daily-reports
        │
        ├── feat/testing-suite           Phase 6 (Testing & Deploy)
        ├── feat/performance-optimization
        ├── feat/docker-production
        │
        └── release/1.0.0               Release
```

---

## Chi tiết từng Phase

### Phase 1: Foundation (Tuần 1-2)

| Branch | Tính năng | Commit liên tục |
|--------|-----------|-----------------|
| `feat/project-setup` | Khởi tạo Next.js + FastAPI | `feat: khởi tạo nextjs frontend`, `feat: tạo fastapi app skeleton` |
| `feat/docker-infrastructure` | Docker Compose services | `feat: thêm postgres + redis docker`, `feat: thêm kafka + timescaledb` |
| `feat/database-schema` | SQLAlchemy models + Alembic | `feat: tạo model User`, `feat: tạo model Portfolio, Holding`, `feat: tạo migration initial` |
| `feat/jwt-authentication` | Register, Login, Guards | `feat: thêm security module (JWT)`, `feat: tạo api đăng ký`, `feat: tạo api đăng nhập`, `feat: thêm role-based guard` |

### Phase 2: Data Pipeline (Tuần 3-4)

| Branch | Tính năng | Commit liên tục |
|--------|-----------|-----------------|
| `feat/kafka-pipeline` | Binance → Kafka producers | `feat: tạo binance websocket producer`, `feat: tạo yahoo finance producer`, `feat: tạo news rss producer` |
| `feat/websocket-server` | Socket.IO server | `feat: tạo socket.io async server`, `feat: thêm subscribe/broadcast rooms` |
| `feat/timescaledb-setup` | Hypertable + aggregates | `feat: tạo market_prices hypertable`, `feat: thêm ohlcv continuous aggregate`, `feat: tạo kafka consumer → timescaledb` |

### Phase 3: Web Features (Tuần 5-8)

| Branch | Tính năng | Commit liên tục |
|--------|-----------|-----------------|
| `feat/realtime-price-table` | Bảng giá real-time (#1) | `feat: tạo api /market/prices`, `feat: tạo PriceTable component`, `feat: tích hợp websocket hook` |
| `feat/trading-charts` | Biểu đồ TradingView (#6) | `feat: tạo api /market/ohlcv`, `feat: tạo TradingChart component`, `feat: thêm RSI/MACD overlay` |
| `feat/market-heatmap` | Heatmap thị trường (#2) | `feat: tạo api /market/heatmap`, `feat: tạo D3 treemap component` |
| `feat/portfolio-management` | Quản lý danh mục (#3) | `feat: tạo api /portfolio`, `feat: tạo portfolio dashboard`, `feat: thêm biểu đồ phân bổ tài sản` |
| `feat/paper-trading` | Giả lập giao dịch (#10) | `feat: tạo trading engine service`, `feat: tạo api /trading/order`, `feat: tạo trading panel UI`, `feat: tạo lịch sử giao dịch` |
| `feat/price-alerts` | Cảnh báo giá (#4) | `feat: tạo api /alerts`, `feat: tạo celery task kiểm tra alerts`, `feat: tạo alert UI component` |
| `feat/stock-screener` | Lọc cổ phiếu (#5) | `feat: tạo api /screener`, `feat: tạo filter panel UI`, `feat: thêm sort/pagination` |
| `feat/order-book` | Sổ lệnh (#7) | `feat: tạo api /market/orderbook`, `feat: tạo orderbook depth chart` |
| `feat/news-aggregator` | Tin tức tổng hợp (#9) | `feat: tạo news celery task`, `feat: tạo api /news`, `feat: tạo news feed component` |
| `feat/economic-calendar` | Lịch kinh tế (#8) | `feat: tạo api /calendar`, `feat: tạo calendar view component` |
| `feat/permission-system` | Phân quyền FREE/PREMIUM (#15) | `feat: tạo require_premium guard`, `feat: tạo pricing page`, `feat: thêm feature lock UI` |

### Phase 4: AI Core (Tuần 9-12)

| Branch | Tính năng | Commit liên tục |
|--------|-----------|-----------------|
| `feat/ai-sentiment-analysis` | Sentiment NLP (#16) | `feat: tạo news scraper`, `feat: tạo SentimentAnalyzer class`, `feat: tạo api /ai/sentiment`, `feat: tạo sentiment gauge UI` |
| → `experiment/phobert-finetune` | Thử nghiệm fine-tune | `experiment: fine-tune phobert trên dataset tài chính`, `experiment: đánh giá accuracy` |
| `feat/ai-price-prediction` | LSTM Prediction (#17) | `feat: tạo feature engineering pipeline`, `feat: tạo PricePredictionLSTM model`, `feat: tạo api /ai/prediction`, `feat: tạo prediction chart UI` |
| → `experiment/lstm-tuning` | Thử nghiệm hyperparams | `experiment: thử 2-layer vs 3-layer LSTM`, `experiment: so sánh MAE/RMSE` |
| `feat/ai-trading-signals` | RL Trading Bot (#18) | `feat: tạo TradingEnvironment gym`, `feat: tạo PPO agent`, `feat: tạo api /ai/signals`, `feat: tạo signal panel UI` |
| → `experiment/ppo-training` | Thử nghiệm RL | `experiment: train PPO 100k steps`, `experiment: evaluate vs random baseline` |

### Phase 5: Premium & Social (Tuần 13-14)

| Branch | Tính năng | Commit liên tục |
|--------|-----------|-----------------|
| `feat/stripe-premium` | Thanh toán Stripe (#15) | `feat: tạo api /subscription/checkout`, `feat: tạo stripe webhook handler`, `feat: tạo pricing page UI` |
| `feat/leaderboard` | Bảng xếp hạng (#11) | `feat: tạo api /leaderboard`, `feat: tạo leaderboard table UI` |
| `feat/copy-trade` | Sao chép giao dịch (#12) | `feat: tạo api /copy-trade/follow`, `feat: tạo celery mirror trade task`, `feat: tạo copy trade UI` |
| `feat/multi-platform-assets` | Đa nền tảng (#13) | `feat: tạo exchange connector service`, `feat: tạo unified portfolio view` |
| `feat/daily-reports` | Báo cáo hàng ngày (#14) | `feat: tạo celery report task`, `feat: tạo report viewer UI` |

### Phase 6: Testing & Deploy (Tuần 15-16)

| Branch | Tính năng | Commit liên tục |
|--------|-----------|-----------------|
| `feat/testing-suite` | Test toàn diện | `test: thêm auth tests`, `test: thêm trading tests`, `test: thêm ai endpoint tests`, `test: thêm playwright e2e` |
| `feat/performance-optimization` | Tối ưu hiệu năng | `perf: thêm redis caching`, `perf: tối ưu db indexes`, `perf: thêm ONNX runtime cho ML` |
| `feat/docker-production` | Docker production | `chore: tạo Dockerfile backend`, `chore: tạo Dockerfile frontend`, `chore: tạo docker-compose.prod.yml` |

---

## Quy trình làm việc mỗi tính năng

```
┌─── /git-branch ────────────────────────────┐
│ git checkout develop                        │
│ git pull origin develop                     │
│ git checkout -b feat/feature-name           │
└─────────────────────────────────────────────┘
          │
          ▼
┌─── Coding & Commits ──────────────────────┐
│ # Code từng phần nhỏ                       │
│ git add .                                   │
│ git commit -m "feat(scope): mô tả"         │
│                                             │
│ # Tiếp tục code                             │
│ git add .                                   │
│ git commit -m "feat(scope): mô tả 2"       │
│                                             │
│ # Sửa bug trong quá trình dev               │
│ git commit -m "fix(scope): sửa lỗi xyz"    │
└─────────────────────────────────────────────┘
          │
          ▼
┌─── /git-sync (thường xuyên) ──────────────┐
│ git fetch origin develop                    │
│ git rebase origin/develop                   │
└─────────────────────────────────────────────┘
          │
          ▼
┌─── Quality Gate ──────────────────────────┐
│ ruff check .                                │
│ pytest tests/ -v                            │
│ npm run lint (frontend)                     │
└─────────────────────────────────────────────┘
          │
          ▼
┌─── /git-merge ────────────────────────────┐
│ git checkout develop                        │
│ git merge feat/feature-name                 │
│ git push origin develop                     │
│ git branch -d feat/feature-name             │
└─────────────────────────────────────────────┘
```

---

## Milestones

| Milestone | Mục tiêu | Branches hoàn thành |
|-----------|---------|---------------------|
| **MVP (Tuần 8)** | Dashboard + Trading cơ bản | Phase 1 + 2 + 3 (P0 features) |
| **v1.0 (Tuần 12)** | + AI Features | + Phase 4 |
| **v1.5 (Tuần 14)** | + Premium & Social | + Phase 5 |
| **v2.0 (Tuần 16)** | Production-ready | + Phase 6 → `release/1.0.0` |
