# Ananda Marga CRM & Mentorship Platform

[![CI & Deploy Bun API](https://github.com/elumixor/am-crm/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/elumixor/am-crm/actions/workflows/ci.yml)

> Central platform to support spiritual progress tracking, mentorship, unit visibility, and initiation journey inside Ananda Marga.

## Overview

This repository houses the code. Full project documentation now lives in the `docs/` folder (published via GitHub Pages when enabled).

## Documentation

Authoritative docs are stored in `docs/` and (once configured) published at the project Pages URL.

### Quick Links

- [Docs Index](https://elumixor.github.io/am-crm/index.html)
- [Vision & Context](https://elumixor.github.io/am-crm/project-vision.html)
- [User Stories](https://elumixor.github.io/am-crm/user-stories.html)
- [Architecture Overview](https://elumixor.github.io/am-crm/architecture.html)
- [Data Model](https://elumixor.github.io/am-crm/data-model.html)
- [Roadmap](https://elumixor.github.io/am-crm/roadmap.html)
- [Public API](https://elumixor.github.io/am-crm/api.html)

## MVP Snapshot

Core capabilities targeted for the first usable release:

- User auth (email magic link) & trait-based roles.
- Units & memberships (secretary auto-mentor).
- Mentor–mentee linking + contact logs + practice regularity.
- Initiation + lesson progression records (acarya managed).
- Telegram bot basic commands (/start /me /mentees /note).
- Daily attention evaluation (contact gap, low practice) – minimal surface.

## Tech Stack (Condensed)

Next.js (React, TypeScript, Tailwind) • Prisma + PostgreSQL • tRPC + Zod • Auth.js • grammY (Telegram) • Bun runtime (built-in test runner) • pino logging.

## Monorepo Layout (Planned vs Current)

Planned high-level structure (from Phase 0 #1):

```
apps/
  web/        # Next.js app
  bot/        # Telegram bot
packages/
  db/         # Prisma schema & client
  core/       # Domain services
  ui/         # Shared components/design system
  config/     # Shared tooling config
  shared/     # Misc shared utilities (may merge into core/ui later)
```

## Contributing

1. Read Vision & Architecture docs (see links above).
2. Pick an Issue labeled `good-first-issue` or part of current Phase.
3. Create feature branch: `feat/<short-topic>`.
4. Ensure lint & tests pass before PR.

## Roadmap Status

See the [Roadmap](https://elumixor.github.io/am-crm/roadmap.html) and open Issues (labels: `mvp`, `post-mvp`).

## License

TBD (placeholder). Do not publicly distribute until finalized.

---

Expanded documentation lives in the Wiki. This README intentionally minimal.

## Current Code Scaffold

Phase 0 scaffolding implemented (Issue #1):

```
packages/
  api/            # Hono HTTP API (placeholder routes)
  db/             # Prisma schema (User model) – migration pending (ensure DATABASE_URL includes user)
  core/           # Domain services placeholder (coreHealth)
  ui/             # UI primitives placeholder (Pill component)
  config/         # Tooling config exports scaffold
  shared/         # Generic shared utilities (sample function + test)
  web/            # Next.js app
  telegram-bot/   # Telegraf bot skeleton
```

This completes the initial monorepo scaffold. Further refinement (merging shared into core/ui, adding real domain models, and exporting actual tool configs) will happen in subsequent issues.

Tooling: Bun, Turbo, Prisma, @biomejs/biome.

Setup:

1. Copy .env.example -> .env and edit.
2. Ensure postgres db am_crm_dev exists & owned by your user.
3. Generate client: `bun run prisma:generate`.
4. (Pending) Resolve P1010 permission to run first migration.
5. Run dev processes: `bun run dev`.

### New Local Quickstart (DB + API + Web)

Quick run from clean clone:

```
cp .env.example .env
bun install
bun run dev:db            # starts Postgres via docker compose
bun run prisma:migrate    # applies migrations & generates client
bun run dev:all           # starts API (3001) + Web SSR (3000)
```

Visit:

- API: http://localhost:3001/
- Users endpoint: http://localhost:3001/users
- Web page (SSR consuming API): http://localhost:3000/

Run tests (DB must be up & migrated):

```
bun test
```

Next steps candidates:

- Resolve Prisma migration permission (P1010).
- Replace web placeholder with Next.js app.
- Add CI workflows.
- Add domain core package & logging.
- Convert current SSR Hono-based web server into full Next.js app (future step).

## Long-Term Feature Horizons (Future / Vision)

These are NOT in scope for current MVP phases, but guide architectural decisions:

- Collective Meditation (Dharma Chakra) Event System
  - Weekly event entity (date, time, timezone, unit, theme, facilitator).
  - Attendance tracking (manual first, later automated via check‑in links or bot reactions).
  - Announcement generator: structured text + branded image (template engine: Satori/Canvas/OG image service) auto-posted to Telegram + optionally email.
  - Scheduling: every Saturday generation + send (cron + idempotency guard).
- Retreats Module
  - Retreat entity (title, schedule, capacity, pricing tier, registration window).
  - Registration & payment linkage (future Stripe/Donorbox integration).
  - Participant roster export + dietary / accommodation fields.
  - Post-retreat follow-up task list & engagement summary.
- Educational Module (LMS‑lite)
  - Course & lesson content (markdown-rich) with progress tracking.
  - Mentor visibility into mentee course progress & blockers.
  - Tagging to correlate course completion with practice/retention metrics.
- Finance Module
  - Donations & contributions ledger (simple double-entry or tagged transactions).
  - Expense tracking per unit / retreat with budget variance.
  - Basic dashboards: monthly inflow/outflow, retreat P&L snapshot.
- Media & Communication Layer
  - Central announcement publish pipeline (web -> Telegram -> email).
  - Template versioning and A/B test hooks (far future).

All above will be tracked initially as `future` labeled issues until promoted into a concrete phase.
