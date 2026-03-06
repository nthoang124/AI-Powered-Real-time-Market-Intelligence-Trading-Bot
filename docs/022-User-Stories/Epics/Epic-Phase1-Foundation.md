---
id: EPIC-001
type: epic
status: draft
project: AI-Trading-Bot
tags: [phase-1, foundation, infrastructure]
linked-to: [[Roadmap-AI-Trading-Bot]]
created: 2026-03-07
updated: 2026-03-07
---

# Epic: Phase 1 — Foundation & Infrastructure

> Implements: [[PRD-AI-Trading-Bot]] | Timeline: **Tuần 1-2**

## Mục tiêu
Dựng skeleton dự án, Docker services, database schema, và JWT authentication.

## Stories

### F1.1: Project Setup
- **Branch**: `feat/project-setup`
- **Trạng thái**: ⬜ TODO
- **Mô tả**: Khởi tạo Next.js 14 frontend + FastAPI backend skeleton
- **Tasks**:
  - [ ] `npx create-next-app` với TypeScript + TailwindCSS + App Router
  - [ ] Tạo FastAPI entry point (`main.py`)
  - [ ] Tạo `config.py` (Pydantic BaseSettings)
  - [ ] Tạo `database.py` (SQLAlchemy async engine)
  - [ ] Cài đặt dependencies (`requirements.txt`)
- **Commits dự kiến**:
  - `feat: khởi tạo nextjs frontend`
  - `feat: tạo fastapi app skeleton`
  - `feat: thêm pydantic settings config`

### F1.2: Docker Infrastructure
- **Branch**: `feat/docker-infrastructure`
- **Trạng thái**: ⬜ TODO
- **Mô tả**: Docker Compose cho PostgreSQL, TimescaleDB, Redis, Kafka
- **Tasks**:
  - [ ] Tạo `docker-compose.dev.yml`
  - [ ] PostgreSQL 16 + TimescaleDB
  - [ ] Redis 7 Alpine
  - [ ] Kafka + Zookeeper
  - [ ] Tạo `.env.example`
- **Commits dự kiến**:
  - `feat: thêm postgres + redis docker`
  - `feat: thêm kafka + zookeeper`
  - `feat: thêm timescaledb service`

### F1.3: Database Schema
- **Branch**: `feat/database-schema`
- **Trạng thái**: ⬜ TODO
- **Dependencies**: F1.2 (Docker services chạy trước)
- **Mô tả**: SQLAlchemy 2.0 models + Alembic migrations
- **Tasks**:
  - [ ] Model: `User` (email, role, hashed_password)
  - [ ] Model: `Portfolio` (balance, user_id)
  - [ ] Model: `Holding` (symbol, quantity, avg_price)
  - [ ] Model: `Trade` (type, quantity, price, total)
  - [ ] Model: `Alert` (symbol, condition, target_price)
  - [ ] Alembic init + initial migration
- **Commits dự kiến**:
  - `feat: tạo model User`
  - `feat: tạo model Portfolio, Holding, Trade`
  - `feat: tạo model Alert`
  - `feat: tạo alembic migration initial`

### F1.4: JWT Authentication
- **Branch**: `feat/jwt-authentication`
- **Trạng thái**: ⬜ TODO
- **Dependencies**: F1.3 (User model)
- **Mô tả**: Register, Login, JWT tokens, Role guards
- **Tasks**:
  - [ ] `core/security.py` — hash, verify, create_token, decode_token
  - [ ] `dependencies.py` — get_current_user, require_premium
  - [ ] `api/auth.py` — POST /register, POST /login
  - [ ] Pydantic schemas (UserCreate, TokenResponse)
  - [ ] Tests: auth happy path + error cases
- **Commits dự kiến**:
  - `feat: thêm security module (JWT + bcrypt)`
  - `feat: tạo api đăng ký`
  - `feat: tạo api đăng nhập`
  - `feat: thêm role-based guard (require_premium)`
  - `test: thêm auth tests`

## Quality Gate
- [ ] Docker services chạy ổn định
- [ ] Backend starts trên port 8000
- [ ] Swagger UI accessible tại /docs
- [ ] Auth endpoints hoạt động (register → login → JWT)
- [ ] Frontend starts trên port 3000
- [ ] Alembic migrations applied thành công
