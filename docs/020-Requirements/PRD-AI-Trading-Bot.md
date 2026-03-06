---
id: PRD-001
type: prd
status: draft
project: AI-Trading-Bot
tags: [prd, requirements, features]
linked-to: [[Roadmap-AI-Trading-Bot]]
created: 2026-03-07
updated: 2026-03-07
---

# PRD — AI-Powered Real-time Market Intelligence & Trading Bot

## 1. Tầm nhìn sản phẩm

Xây dựng nền tảng phân tích thị trường tài chính & hỗ trợ giao dịch thông minh, tích hợp AI để cung cấp insight real-time cho nhà đầu tư.

## 2. Mục tiêu kinh doanh

| Mục tiêu | KPI | Target |
|---------|-----|--------|
| Thu hút người dùng | Registered users | 1,000 (MVP) |
| Engagement | DAU / MAU ratio | > 30% |
| Revenue | Premium subscribers | 10% conversion |
| AI Accuracy | Directional prediction | > 55% |

## 3. Đối tượng mục tiêu

### Persona 1: Nhà đầu tư cá nhân
- Muốn theo dõi giá real-time, P&L portfolio
- Cần cảnh báo giá, biểu đồ kỹ thuật
- Sử dụng miễn phí (FREE tier)

### Persona 2: Trader chuyên nghiệp
- Cần AI insights: sentiment, prediction, signals
- Sử dụng paper trading để backtest chiến lược
- Sẵn sàng trả phí Premium

## 4. Phân loại tính năng (MoSCoW)

### Must-Have (P0) — MVP
| # | Tính năng | Phase |
|---|-----------|-------|
| 1 | JWT Authentication | Phase 1 |
| 2 | Bảng giá Real-time | Phase 3 |
| 3 | Biểu đồ kỹ thuật | Phase 3 |
| 4 | Portfolio Management | Phase 3 |
| 5 | Paper Trading | Phase 3 |
| 6 | Hệ thống phân quyền | Phase 3 |

### Should-Have (P1)
| # | Tính năng | Phase |
|---|-----------|-------|
| 7 | Market Heatmap | Phase 3 |
| 8 | Price Alerts | Phase 3 |
| 9 | Stock Screener | Phase 3 |
| 10 | Order Book | Phase 3 |
| 11 | News Aggregator | Phase 3 |

### Could-Have (P2)
| # | Tính năng | Phase |
|---|-----------|-------|
| 12 | Economic Calendar | Phase 3 |
| 13 | AI Sentiment | Phase 4 |
| 14 | AI Price Prediction | Phase 4 |
| 15 | AI Trading Signals | Phase 4 |
| 16 | Stripe Premium | Phase 5 |
| 17 | Leaderboard | Phase 5 |

### Won't-Have (this version)
| # | Tính năng | Lý do |
|---|-----------|-------|
| — | Mobile app | Chưa ưu tiên, responsive web đủ |
| — | Live trading | Chỉ paper trading, tránh rủi ro pháp lý |

## 5. Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | Next.js 14+, TypeScript, TailwindCSS |
| Backend | **Python 3.12+, FastAPI, SQLAlchemy 2.0** |
| AI/ML | PyTorch, Transformers, Stable Baselines3 |
| Database | PostgreSQL, TimescaleDB, Redis |
| Streaming | Apache Kafka, python-socketio |
| Payment | Stripe |
| Infra | Docker, Nginx, GitHub Actions |

## 6. Tiêu chí chấp nhận

- [ ] 18 tính năng hoạt động end-to-end
- [ ] AI models integrated trực tiếp vào backend
- [ ] FREE/PREMIUM tier phân quyền đúng
- [ ] WebSocket cập nhật giá < 1s latency
- [ ] Backend test coverage > 80%
- [ ] Docker production build thành công

## Related Epics
- [[Epic-Phase1-Foundation]]
- [[Epic-Phase2-DataPipeline]]
- [[Epic-Phase3-WebFeatures]]
- [[Epic-Phase4-AICore]]
- [[Epic-Phase5-PremiumSocial]]
- [[Epic-Phase6-TestingDeploy]]
