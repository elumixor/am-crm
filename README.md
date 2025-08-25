# Ananda Marga CRM & Mentorship Platform

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
Next.js (React, TypeScript, Tailwind) • Prisma + PostgreSQL • tRPC + Zod • Auth.js • grammY (Telegram) • Bun runtime • Vitest (+ Playwright later) • pino logging.

## Monorepo Layout (Planned)
```
apps/
  web/    # Next.js app
  bot/    # Telegram bot
packages/
  db/     # Prisma schema & client
  core/   # Domain services
  ui/     # Shared components
  config/ # Shared tooling config
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

## Current Code Scaffold (WIP)

Temporary Bun + Turbo monorepo (will evolve to planned layout):

```
packages/
  api/            # Hono HTTP API (placeholder routes)
  db/             # Prisma schema (User model) – migration pending (ensure DATABASE_URL includes user)
  shared/         # Shared utilities (sample function + test)
  web/            # Minimal React placeholder
  telegram-bot/   # Telegraf bot skeleton
```

Tooling: Bun, Turbo, Prisma, Vitest, @biomejs/biome.

Setup:
1. Copy .env.example -> .env and edit.
2. Ensure postgres db am_crm_dev exists & owned by your user.
3. Generate client: `bun run prisma:generate`.
4. (Pending) Resolve P1010 permission to run first migration.
5. Run dev processes: `bun run dev`.

Next steps candidates:
- Resolve Prisma migration permission (P1010).
- Replace web placeholder with Next.js app.
- Add CI workflows.
- Add domain core package & logging.
