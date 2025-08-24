# Ananda Marga CRM & Mentorship Platform

> Central platform to support spiritual progress tracking, mentorship, unit visibility, and initiation journey inside Ananda Marga.

## Overview
This repository houses the code. Full project documentation now lives in the GitHub Wiki (mirrored here under `wiki/` for offline editing).

## Documentation (Wiki)
Primary documentation is in the GitHub Wiki. For offline work you can optionally clone it into a local `wiki/` folder (ignored by git) using:

```
git clone https://github.com/elumixor/am-crm.wiki.git wiki
```

### Quick Links
- [Public Wiki Home](https://github.com/elumixor/am-crm/wiki)
- [Vision & Context](https://github.com/elumixor/am-crm/wiki/Project-Vision)
- [User Stories](https://github.com/elumixor/am-crm/wiki/User-Stories)
- [Architecture Overview](https://github.com/elumixor/am-crm/wiki/Architecture)
- [Data Model Details](https://github.com/elumixor/am-crm/wiki/Data-Model)
- [Roadmap & Milestones](https://github.com/elumixor/am-crm/wiki/Roadmap)

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
See the [Roadmap](https://github.com/elumixor/am-crm/wiki/Roadmap) and open Issues (labels: `mvp`, `post-mvp`).

## License
TBD (placeholder). Do not publicly distribute until finalized.

---
Expanded documentation lives in the Wiki. This README intentionally minimal.
