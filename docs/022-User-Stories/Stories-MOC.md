---
id: MOC-STORIES
type: moc
status: approved
project: AI-Trading-Bot
created: 2026-03-07
updated: 2026-03-07
---

# 🎯 Feature Tracker — Map of Content

> **Bảng kiểm soát chính** để theo dõi trạng thái tất cả tính năng của dự án.

## Ký hiệu trạng thái

| Icon | Trạng thái | Ý nghĩa |
|------|-----------|---------|
| ⬜ | TODO | Chưa bắt đầu |
| 🟡 | IN PROGRESS | Đang phát triển (có branch) |
| 🔵 | IN REVIEW | Code xong, đang review/test |
| ✅ | DONE | Đã merge vào `develop` |
| ❌ | BLOCKED | Bị chặn bởi dependency |

---

## Phase 1: Foundation & Infrastructure

> **Epic**: [[Epic-Phase1-Foundation]] | **Tuần**: 1-2

| # | Tính năng | Branch | Trạng thái | Ghi chú |
|---|-----------|--------|-----------|---------|
| F1.1 | Project setup (Next.js + FastAPI) | `feat/project-setup` | ⬜ TODO | |
| F1.2 | Docker infrastructure | `feat/docker-infrastructure` | ⬜ TODO | |
| F1.3 | Database schema (SQLAlchemy) | `feat/database-schema` | ⬜ TODO | Depends: F1.2 |
| F1.4 | Supabase Authentication | `feat/supabase-authentication` | ⬜ TODO | Depends: F1.3 |

---

## Phase 2: Market Data Pipeline

> **Epic**: [[Epic-Phase2-DataPipeline]] | **Tuần**: 3-4

| # | Tính năng | Branch | Trạng thái | Ghi chú |
|---|-----------|--------|-----------|---------|
| F2.1 | Kafka pipeline (producers) | `feat/kafka-pipeline` | ⬜ TODO | Depends: F1.2 |
| F2.2 | WebSocket server | `feat/websocket-server` | ⬜ TODO | Depends: F1.1 |
| F2.3 | PostgreSQL Partitioning | `feat/pg-partman-setup` | ⬜ TODO | Depends: F2.1 |

---

## Phase 3: Core Web Features

> **Epic**: [[Epic-Phase3-WebFeatures]] | **Tuần**: 5-8

| # | Tính năng | Branch | Trạng thái | Priority | Ghi chú |
|---|-----------|--------|-----------|----------|---------|
| F3.1 | Bảng giá Real-time | `feat/realtime-price-table` | ⬜ TODO | 🔴 P0 | Depends: F2.2, F2.3 |
| F3.2 | Biểu đồ kỹ thuật (TradingView) | `feat/trading-charts` | ⬜ TODO | 🔴 P0 | Depends: F2.3 |
| F3.3 | Heatmap thị trường | `feat/market-heatmap` | ⬜ TODO | 🟡 P1 | |
| F3.4 | Quản lý Portfolio | `feat/portfolio-management` | ⬜ TODO | 🔴 P0 | Depends: F1.4 |
| F3.5 | Paper Trading | `feat/paper-trading` | ⬜ TODO | 🔴 P0 | Depends: F3.4 |
| F3.6 | Cảnh báo giá | `feat/price-alerts` | ⬜ TODO | 🟡 P1 | Depends: F2.3 |
| F3.7 | Stock Screener | `feat/stock-screener` | ⬜ TODO | 🟡 P1 | |
| F3.8 | Order Book | `feat/order-book` | ⬜ TODO | 🟡 P1 | |
| F3.9 | Tin tức tổng hợp | `feat/news-aggregator` | ⬜ TODO | 🟡 P1 | |
| F3.10 | Lịch kinh tế | `feat/economic-calendar` | ⬜ TODO | 🟢 P2 | |
| F3.11 | Hệ thống phân quyền | `feat/permission-system` | ⬜ TODO | 🔴 P0 | Depends: F1.4 |

---

## Phase 4: AI Core Features

> **Epic**: [[Epic-Phase4-AICore]] | **Tuần**: 9-12

| # | Tính năng | Branch | Trạng thái | Ghi chú |
|---|-----------|--------|-----------|---------|
| F4.1 | Sentiment Analysis (PhoBERT) | `feat/ai-sentiment-analysis` | ⬜ TODO | + `experiment/phobert-finetune` |
| F4.2 | Price Prediction (LSTM) | `feat/ai-price-prediction` | ⬜ TODO | + `experiment/lstm-tuning` |
| F4.3 | AI Trading Signals (RL/PPO) | `feat/ai-trading-signals` | ⬜ TODO | + `experiment/ppo-training` |

---

## Phase 5: Premium & Social Features

> **Epic**: [[Epic-Phase5-PremiumSocial]] | **Tuần**: 13-14

| # | Tính năng | Branch | Trạng thái | Ghi chú |
|---|-----------|--------|-----------|---------|
| F5.1 | Stripe Premium | `feat/stripe-premium` | ⬜ TODO | |
| F5.2 | Bảng xếp hạng | `feat/leaderboard` | ⬜ TODO | Depends: F3.5 |
| F5.3 | Copy Trade | `feat/copy-trade` | ⬜ TODO | Depends: F3.5 |
| F5.4 | Multi-platform Assets | `feat/multi-platform-assets` | ⬜ TODO | |
| F5.5 | Báo cáo hàng ngày | `feat/daily-reports` | ⬜ TODO | Depends: F4.1, F4.2 |

---

## Phase 6: Testing & Deployment

> **Epic**: [[Epic-Phase6-TestingDeploy]] | **Tuần**: 15-16

| # | Tính năng | Branch | Trạng thái | Ghi chú |
|---|-----------|--------|-----------|---------|
| F6.1 | Testing suite | `feat/testing-suite` | ⬜ TODO | |
| F6.2 | Performance optimization | `feat/performance-optimization` | ⬜ TODO | |
| F6.3 | Docker production | `feat/docker-production` | ⬜ TODO | |

---

## Tóm tắt

| Phase | Tổng | ✅ Done | 🟡 In Progress | ⬜ TODO |
|-------|------|---------|----------------|---------|
| Phase 1 | 4 | 0 | 0 | 4 |
| Phase 2 | 3 | 0 | 0 | 3 |
| Phase 3 | 11 | 0 | 0 | 11 |
| Phase 4 | 3 | 0 | 0 | 3 |
| Phase 5 | 5 | 0 | 0 | 5 |
| Phase 6 | 3 | 0 | 0 | 3 |
| **Tổng cộng** | **29** | **0** | **0** | **29** |
