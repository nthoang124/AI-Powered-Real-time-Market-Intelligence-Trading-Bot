---
id: RESEARCH-001
type: research
status: approved
project: AI-Trading-Bot
tags: [git-flow, branching, feature-development, best-practices]
created: 2026-03-07
---

# Nghiên cứu: Git Flow Feature-Branch Strategy cho AI Trading Bot

## 1. Tóm tắt nghiên cứu

Nghiên cứu chiến lược Git Flow phù hợp nhất cho dự án AI Trading Bot — một dự án bao gồm 15 Web Features + 3 AI Core Features, phát triển bằng Python (FastAPI) + Next.js.

## 2. Kết quả chính

### 2.1 Mô hình branch chính (Git Flow)

```
main (production-ready)
 └── develop (integration branch)
      ├── feat/realtime-price-table      ← Feature #1
      ├── feat/market-heatmap            ← Feature #2
      ├── feat/portfolio-management      ← Feature #3
      ├── feat/price-alerts              ← Feature #4
      ├── ...
      ├── feat/ai-sentiment-analysis     ← AI Feature #1
      │    ├── experiment/phobert-v2     ← Thử nghiệm ML
      │    └── experiment/finbert        ← Thử nghiệm ML
      ├── feat/ai-price-prediction       ← AI Feature #2
      ├── feat/ai-trading-signals        ← AI Feature #3
      ├── release/1.0.0                  ← Release branch
      └── hotfix/critical-bug-fix        ← Hotfix
```

### 2.2 Best Practices từ nghiên cứu

| Insight | Áp dụng cho dự án |
|---------|-------------------|
| Branch ngắn hạn (days, not weeks) | Chia feature lớn thành sub-features |
| Rebase thường xuyên từ `develop` | Tránh conflict khi merge |
| Conventional Commits (Tiếng Việt) | Đúng chuẩn team hiện có |
| Experiment branches cho ML | `experiment/` sub-branch trong `feat/ai-*` |
| Quality Gates trước merge | Lint + test + review trước khi merge vào `develop` |
| Feature toggles cho code chưa hoàn thiện | Dùng role guard (FREE/PREMIUM) |

### 2.3 Quy trình phát triển 1 feature

```
1. /git-branch  → Tạo feat/feature-name từ develop
2. Coding       → Commit liên tục (feat, fix, refactor...)
3. /git-sync    → Rebase từ develop thường xuyên
4. Testing      → pytest / playwright
5. /git-commit  → Commit cuối cùng
6. /git-merge   → Merge vào develop (solo project)
```

## 3. Nguồn tham khảo

- Git Flow branching model (Atlassian, GitKraken)
- Towards Data Science — Git Flow for ML projects
- Modern Feature Branch Workflow best practices 2025
