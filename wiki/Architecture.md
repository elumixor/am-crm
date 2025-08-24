# Architecture Overview

## High-Level Approach
Monolith-first Next.js application (App Router) + shared database accessed by both web and Telegram bot.

## Components
| Component | Responsibility | Tech |
|-----------|----------------|------|
| Web UI | Pages, dashboards, forms | Next.js (React, Tailwind, Radix) |
| API Layer | tRPC procedures / route handlers | tRPC + Zod |
| Auth | Sessions, email magic link, Telegram linking | Auth.js |
| DB | Persistence | PostgreSQL + Prisma |
| Bot | Messaging, quick actions, reminders | grammY (TypeScript) |
| Background Jobs | Reminder generation & scheduled tasks | Serverless cron (initial) |
| Queue (future) | Offload heavier tasks | Redis + BullMQ |

## Data Flow (MVP)
1. User action (web or Telegram) invokes tRPC / route handler.
2. Input validated by Zod.
3. Prisma client persists/queries Postgres.
4. Response hydrated into UI or bot message.
5. Reminders cron scans DB daily, flags attention items.

## Key Design Decisions
- Monolith for speed; internal modules for separation (db, services, bot).
- tRPC for end-to-end typing; reconsider GraphQL only if third-party consumers emerge.
- Minimal events; rely on transactional consistency first.
- Add caching only when query latency > acceptable thresholds.

## Module Boundaries (Suggested)
```
packages/
  db/        # Prisma schema & generated client wrapper
  core/      # Pure domain services (mentor assignment, reminder rules)
  ui/        # Shared components
  config/    # ESLint, TS, Tailwind presets
apps/
  web/       # Next.js app
  bot/       # Telegram bot
```

## Access Control Strategy
Trait/role checks centralized in a small authorization helper.

## Observability & Logging
- pino for JSON logs.
- Basic request logging middleware.
- Audit log table for critical changes.

## Scaling Paths
- Move bot to webhook + serverless function.
- Add read replicas for heavy reporting.
- Introduce event outbox for async projections.

## Security Considerations
- Principle of least privilege (only necessary traits open routes).
- Rate limit bot commands per user.
- CSRF mitigated by Next.js built-ins and same-site cookies.

---
_Last updated: placeholder._
