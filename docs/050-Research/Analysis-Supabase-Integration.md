---
id: RESEARCH-002
type: research
status: draft
project: AI-Trading-Bot
tags: [supabase, architecture, auth, database, realtime]
created: 2026-03-07
---

# Nghiên cứu: Tích hợp Supabase vào AI Trading Bot

## 1. Tóm tắt tình trạng
Dự án đã kết nối thành công với Supabase MCP. Workspace có sẵn Project Supabase: **AI-Powered-Real-time-Market-Intelligence-Trading-Bot** (Mã: `ncmgapkkagozpllhmrfv`, PostgreSQL 17). Việc chuyển từ Database/Auth local (Docker) sang Supabase sẽ thay đổi đáng kể kiến trúc Phase 1 & 2.

## 2. Kết quả nghiên cứu chuyên sâu (2025)

### 2.1 Quản lý Dữ liệu Chuỗi thời gian (Time-series)
- **Vấn đề cốt lõi**: Supabase **đã ngừng hỗ trợ extension TimescaleDB** trên PostgreSQL 17+. Cơ sở dữ liệu hiện tại của project `ncmgapkkagozpllhmrfv` đang chạy PG17.
- **Giải pháp thay thế**: 
  - Sử dụng **PostgreSQL Native Partitioning** (thông qua extension `pg_partman` được Supabase hỗ trợ) thay cho Hypertable của TimescaleDB.
  - Vẫn đáp ứng tốt cho nến OHLCV (1m, 5m, 1h, 1d), nhưng truy vấn sẽ cần viết bằng SQL chuẩn thay vì dùng các hàm đặc thù của TimescaleDB (như `time_bucket`).

### 2.2 Xác thực & Phân quyền (Auth & RLS)
- **Chuyển đổi Auth**: Bỏ hoàn toàn hệ thống tự build bằng `passlib/bcrypt` và `python-jose` tự tạo token ở backend.
- **Quy trình mới (Best Practice)**: 
  - Client đăng nhập trực tiếp qua **Supabase Auth** (email/password, OAuth, Magic Link).
  - Client gọi API của FastAPI kèm theo JWT Token của Supabase (Access Token) trên Authorization header.
  - **FastAPI backend**: Chỉ đóng vai trò **Xác thực Token** (verify JWT bằng public key của Supabase) và từ chối nếu token không hợp lệ.
- **Row-Level Security (RLS)**: Bật RLS trên bảng `portfolios`, `trades` để user chỉ được query data của chính mình trực tiếp từ client (nếu dùng Supabase JS client) hoặc bảo mật dữ liệu cấp DB.

### 2.3 Real-time & Data Streaming
- **Raw Price Ticks**: Binance xả hàng ngàn tin nhắn WebSocket mỗi giây. Việc dùng Supabase Realtime để broadcast raw ticks có thể gây tốn quota/chi phí khổng lồ.
- **Best Practice Architect**:
  - Dữ liệu thô (raw ticks) vẫn đi qua -> **Kafka** -> **FastAPI + Socket.IO** để bắn thẳng cho client (giữ nguyên).
  - FastAPI tổng hợp nến (1m, 5m) và lưu vào **Supabase Postgres**.
  - **Supabase Realtime** chỉ dùng cho các sự kiện tần suất thấp: Cảnh báo giá (Price Alerts match), Notification, Cập nhật trạng thái copy trade.

## 3. Đánh đổi (Trade-offs)

| Yếu tố | Local Docker (Postgres+JWT) | BaaS (Supabase) |
|--------|------------------------------|-----------------|
| **Tốc độ Dev** | Chậm (Tự code Auth, Config) | Rất nhanh (Out-of-box Auth, DB) |
| **Bảo mật** | Rủi ro rò rỉ JWT secret | Enterprise-grade (RLS, Supabase Auth) |
| **Time-series DB** | Rất mạnh (TimescaleDB hypertable) | Trung bình (PG native partitioning) |
| **Chi phí** | Chỉ tốn tiền server tổng | Tốn phí theo usage nếu vượt Free Tier |

## 4. Hành động đề xuất
1. **Refactor Phase 1**: Xóa code custom JWT JWT Auth, thay bằng Supabase Auth middleware. Xóa cấu hình DB local, trỏ SQLAlchemy về Supabase connection string.
2. **Refactor PRD / Roadmap**: Cập nhật Database Stack từ TimescaleDB sang Supabase PostgreSQL + `pg_partman`.
3. **Cập nhật Database Schema**: Áp dụng user ID dạng UUID do Supabase Auth cấp (Auth.users).
