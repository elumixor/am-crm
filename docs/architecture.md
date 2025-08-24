---
title: Architecture Overview
layout: page
---

# Architecture Overview

## High-Level Approach
Monolith-first Next.js (App Router) + shared PostgreSQL database accessed by web app and Telegram bot.

## Components

| Role          | Responsibilities                                   | Notes                      |
|---------------|---------------------------------------------------|----------------------------|
| Newcomer      | Attend events, register, start practices           | Not initiated yet          |
| Margii        | Regular meditation, lesson progression             | Has at least 1 lesson      |
| Mentor        | Guide mentees, track progress, give support        | Can be unit secretary too  |
| Unit Secretary| Track unit status, oversee mentors and margiis     | Acts as mentor if needed   |
| Acarya        | Give initiation, track initiates, support margiis  | Monk role                  |
| Admin         | Manage accounts, roles, and units                  | Full system permissions    |



| Component | Responsibility | Tech |
|-----------|----------------|------|
| Web UI | Pages, dashboards, forms | Next.js (React, Tailwind, Radix) |
| API Layer | tRPC procedures / route handlers | tRPC + Zod |
| Auth | Sessions, email magic link, Telegram linking | Auth.js |
| DB | Persistence | PostgreSQL + Prisma |
| Bot | Messaging, quick actions, reminders | grammY (TypeScript) |
| Background Jobs | Reminders & scheduled tasks | Serverless cron (initial) |
| Queue (future) | Offload heavier tasks | Redis + BullMQ |

## Data Flow (MVP)
1. User action triggers tRPC / handler.
2. Input validated (Zod).
3. Prisma persists / queries data.
4. Response returned to UI or bot.
5. Daily cron evaluates attention rules.

## Module Layout (Proposed)
```
packages/
  db/        # Prisma schema & generated client wrapper
  core/      # Domain services (mentor assignment, reminders)
  ui/        # Shared components
  config/    # Shared ESLint/TS/Tailwind config
apps/
  web/       # Next.js app
  bot/       # Telegram bot
```

## Access Control
Trait/role checks centralized; ownership checks on relations; admin override.

## Observability
Structured logs (pino) + audit log table; metrics later.

## Scaling Paths
- Webhooks for bot.
- Read replicas for reporting.
- Event outbox if async projections grow.

## Security
- Least privilege.
- Rate limiting bot commands.
- Same-site cookies / CSRF protections.

---
_Last updated: placeholder._
