---
id: EPIC-003
type: epic
status: draft
project: AI-Trading-Bot
tags: [phase-3, web-features, frontend, backend]
linked-to: [[Roadmap-AI-Trading-Bot]]
created: 2026-03-07
updated: 2026-03-07
---

# Epic: Phase 3 — Core Web Features

> Implements: [[PRD-AI-Trading-Bot]] | Timeline: **Tuần 5-8**

## Mục tiêu
Xây dựng 11 tính năng web chính: từ bảng giá real-time đến hệ thống phân quyền.

## Stories

| # | Story | Branch | Priority | Trạng thái | Dependencies |
|---|-------|--------|----------|-----------|-------------|
| F3.1 | Bảng giá Real-time | `feat/realtime-price-table` | 🔴 P0 | ⬜ TODO | F2.2, F2.3 |
| F3.2 | Biểu đồ TradingView | `feat/trading-charts` | 🔴 P0 | ⬜ TODO | F2.3 |
| F3.3 | Heatmap thị trường | `feat/market-heatmap` | 🟡 P1 | ⬜ TODO | F2.3 |
| F3.4 | Quản lý Portfolio | `feat/portfolio-management` | 🔴 P0 | ⬜ TODO | F1.4 |
| F3.5 | Paper Trading | `feat/paper-trading` | 🔴 P0 | ⬜ TODO | F3.4 |
| F3.6 | Cảnh báo giá | `feat/price-alerts` | 🟡 P1 | ⬜ TODO | F2.3 |
| F3.7 | Stock Screener | `feat/stock-screener` | 🟡 P1 | ⬜ TODO | — |
| F3.8 | Order Book | `feat/order-book` | 🟡 P1 | ⬜ TODO | — |
| F3.9 | Tin tức tổng hợp | `feat/news-aggregator` | 🟡 P1 | ⬜ TODO | — |
| F3.10 | Lịch kinh tế | `feat/economic-calendar` | 🟢 P2 | ⬜ TODO | — |
| F3.11 | Hệ thống phân quyền | `feat/permission-system` | 🔴 P0 | ⬜ TODO | F1.4 |

## Thứ tự triển khai khuyến nghị

```
F3.11 (Permission) → F3.1 (Giá) → F3.2 (Charts) → F3.4 (Portfolio) → F3.5 (Trading)
→ F3.3 (Heatmap) → F3.6 (Alerts) → F3.7 (Screener) → F3.8 (Order Book)
→ F3.9 (News) → F3.10 (Calendar)
```

## Quality Gate
- [ ] Dashboard renders với real-time data
- [ ] TradingView charts hiển thị đúng OHLCV
- [ ] Paper trading BUY/SELL hoạt động end-to-end
- [ ] Portfolio P&L cập nhật theo giá thị trường
- [ ] Price alerts trigger notification
- [ ] FREE vs PREMIUM feature gates hoạt động
