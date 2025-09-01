# Roadmap & Milestones

## Phase 0 – Inception

- Finalize data model v1
- Hosting strategy selection (Vercel + Neon)
- Repo scaffolding

## Phase 1 – Identity & Units

- Auth (email magic link)
- User profile base
- Unit CRUD + membership
- Trait assignment (admin)

## Phase 2 – Mentorship Basics

- Mentor–mentee linking UI
- Contact logs
- Practice regularity enum & field
- Mentor dashboard

## Phase 3 – Initiation & Lessons

- Initiation form
- Lesson progression CRUD & display
- Acarya dashboard

## Phase 4 – Telegram Bot MVP

- Bot skeleton & /start linking
- /me /mentees /note commands
- Daily cron skeleton

## Phase 5 – Attention Engine

- Rule evaluation
- Attention list surface (web + bot)
- Daily summary message

## Phase 6 – Unit Secretary Dashboard

- Aggregated counts
- Unassigned mentees list
- Mentor load visualization

## Phase 7 – Hardening

- Audit log
- Metrics baseline
- Privacy review plan

## Icebox

See Issues with label `future` / `icebox`.

## Future Thematic Phases (Conceptual)

These are provisional and will be decomposed into concrete phases once MVP stabilization & adoption metrics are met.

### Collective Meditation (DC) Platform

- Weekly DC event entity (unit, time, facilitator, theme)
- Attendance capture (manual UI + bot quick action)
- Automated Saturday announcement generation (text + OG image) & Telegram posting
- Attendance trend reports (per unit, per mentor group)
- Tag integration with Attention Engine (low attendance flag)

### Retreats Module

- Retreat CRUD (schedule blocks, capacity) [future]
- Participant registration (non-payment first) [future]
- Payment integration (Stripe or Donorbox) [future]
- Dietary & accommodation data capture [future]
- Post-retreat engagement summary + follow-up reminders [future]

### Educational (LMS-lite)

- Course & lesson catalog (markdown) [future]
- Progress tracking + completion timestamps [future]
- Mentor dashboard extension: course gaps [future]
- Content versioning workflow (simple draft/publish) [future]

### Finance & Ledger

- Donation entry import (CSV / API) [future]
- Retreat income & expense tagging [future]
- Basic ledger with double-entry or simplified categorized txns (decision pending) [future]
- Budget vs actual per unit / retreat [future]

### Communication & Announcement Engine

- Template system (handlebars / React OG image) [future]
- Multi-channel dispatch (Telegram, email) [future]
- Scheduling & idempotent job execution [future]
- Analytics (open / click / engagement) [far-future]

## Labels (Proposed)

| Label            | Meaning                           |
| ---------------- | --------------------------------- |
| mvp              | Required for first usable release |
| post-mvp         | Enhances UX after launch          |
| future           | Longer-term idea                  |
| question         | Needs clarification               |
| blocked          | Waiting on dependency             |
| good-first-issue | Low complexity onboarding         |

---

_Last updated: placeholder._
