# Ananda Marga CRM & Mentorship Platform (Working Title)

> A lightweight, extensible platform to track spiritual progress, mentorship, unit health, and communication within the Ananda Marga (AM) organization.

## 1. Vision
Provide a unified system where seekers (pre‑initiation), new margiis, mentors, unit secretaries, and acaryas can:
- Stay connected and supported on the meditation path.
- Track initiation, lessons, practice regularity, education progress, and engagement in collective practices (e.g., Dharma Chakra / DC).
- Help mentors and acaryas allocate attention where it is most needed through gentle visibility and reminders.
- Maintain accurate, privacy‑respectful data about units, people, and their developmental journey.

Long‑term: integrate educational content (courses, videos hosted on YouTube/RuTube/other), analytics, richer communication, and automations.

## 2. Problems We Are Solving (Pain Points)
- Fragmented tracking of who is initiated, lesson progression, and meditation regularity.
- Hard to know which margiis need contact or support.
- No centralized roster of units, mentors, acaryas, and relationships.
- Inconsistent onboarding for seekers & newly initiated margiis.
- Manual, ad‑hoc reminders ("haven't contacted person X in Y days").
- Lack of structured educational journey visibility.

## 3. Goals (MVP)
1. Store and view core person records (contact info, roles/traits, unit, acarya, mentor, initiation status, received lessons, practice frequency snapshot).
2. Manage units and assign unit secretaries (auto become mentor unless overridden).
3. Allow mentors & unit secretaries to add / invite mentees (self‑registration via invite link or Telegram bot OTP).
4. Let acaryas view people they initiated and their status (lessons, activity indicators, last contact log).
5. Basic contact logging + last contact date + simple reminders (e.g., highlight > X days inactivity/contact gap).
6. Role / trait based access (not initiated, initiated, mentor, unit secretary, acarya, admin).
7. Telegram bot: user linking + basic queries ("who are my mentees?", "my status", simple reminders DM) & quick check‑ins.
8. Secure authentication & authorization foundation (session, roles, ownership checks).

## 4. Non‑Goals (MVP)
- Full educational learning platform (only placeholders / future hooks).
- Complex analytics dashboards (simple aggregated counts only: total unit members, DC attendance placeholder).
- Payment, donations, or e‑commerce.
- Multi‑language UI (design for future i18n, not implemented yet).
- Full Kubernetes or complex microservice deployment (start simple, scale later).

## 5. Personas & Roles
| Persona | Core Needs |
|---------|------------|
| Seeker (not initiated) | Learn basics, register, connect with mentor, optionally request initiation. |
| New Margii (initiated w/ early lessons) | Guided progress, reminders, learning resources, inspiration, access to mentor & unit. |
| Established Margii | Track own lesson status, stay connected, optionally mentor. |
| Mentor | Track mentees' status, last contacts, who needs support, log interactions, receive reminders. |
| Unit Secretary | Oversee unit health: counts, attendance trends, mentors coverage, escalate needs. |
| Acarya | See initiates, progression, support needs, schedule visits, lesson/gap overview. |
| Administrator | Manage roles, units, acaryas, global settings, data integrity. |

System Roles / Traits (assignable): `seeker`, `initiated`, `mentor`, `unit_secretary`, `acarya`, `admin`. Traits are additive; logic composes permissions.

## 6. Domain Glossary
- Unit: Geographic / organizational grouping (city / region). Has a Unit Secretary and optional mentors.
- Mentor: Any user with at least one mentee relationship.
- Initiation: Event linking acarya -> person with date; confers `initiated` trait.
- Lesson: One of six progression steps; each has date received.
- Nama Mantra: Pre-init preparatory stage (flag before full initiation).
- Dharma Chakra (DC): Specialized collective meditation. Attendance frequency indicates engagement.
- Practice Regularity: Self- or mentor-reported measure (e.g., times/day, weekly frequency).
- Contact Log: Entry capturing interaction (date, channel, notes, flags: needs_support, urgent, etc.).
- Reminder: System-generated or manual follow-up task.
- Educational Course: (Future) structured content entity, completion tracking.

## 7. Core User Stories (Initial Set)
### Seeker / New Margii
- As a seeker I want to register easily via web or Telegram to start receiving support.
- As a new margii I want to view my mentor and acarya contact info.
- As a new margii I want to see which lesson(s) I've received and what is next.
- As a new margii I want curated educational material (placeholder list now).

### Mentor
- As a mentor I want to see all my mentees with status indicators (last contact date, practice regularity, lessons, flags).
- As a mentor I want to record a quick contact note (web or Telegram) so I remember follow-ups.
- As a mentor I want reminders when I haven't contacted a mentee in X days.
- As a mentor I want to invite a new person so they self-complete their profile.

### Unit Secretary
- As a unit secretary I want to see unit-wide summary: total people, initiated vs not, DC attendance %, lesson distribution, coverage (mentees without mentor), active mentors count.
- As a unit secretary I want to reassign mentors / accept mentor volunteers.
- As a unit secretary I want to add or approve a new unit member.

### Acarya
- As an acarya I want to see all initiations I performed and each person's lesson progression.
- As an acarya I want to know which initiated margiis may need encouragement (low attendance / low practice regularity / no recent contact logs).
- As an acarya I want to schedule or record an initiation event quickly.

### Administrator
- As an admin I want to manage roles and traits safely (audit log for changes).
- As an admin I want to create units and assign unit secretaries and acaryas.

### Cross-Cutting / Communication
- As a user I want to link my Telegram account to receive reminders.
- As a mentor I want to ask the bot "who needs attention today" and get a prioritized list.

### Future / Educational Platform
- As a margii I want to enroll in a course and see progress.
- As a mentor I want to see which courses my mentees completed.

## 8. Functional Requirements (MVP Summary)
1. User registration + invitation flow (web + Telegram start).
2. Role/trait assignment (admin UI) & self-service limited profile editing.
3. Unit CRUD (admin) & listing (public search minimal: city, country).
4. Mentor–mentee linking (mentor or unit secretary or admin) + acceptance model optional (later).
5. Initiation record + lesson progression updates (acarya or admin; mentor can view).
6. Contact log create/view; last contact & days since derived.
7. Practice regularity attribute (simple enum: NONE / IRREGULAR / WEEKLY / DAILY / TWICE_DAILY) + last updated.
8. Telegram bot: account linking, list mentees, quick status snippet, add contact note, show "attention" list.
9. Basic reminders engine (daily scheduled job computing attention list).
10. Simple dashboards (mentor: table/list; unit secretary: aggregated counts; acarya: initiates list).

## 9. Non-Functional Requirements (Initial)
- Privacy & minimal data: store only needed contact channels (email, phone optional, Telegram handle/id, city).
- GDPR-ready: deletion & export (roadmap, not MVP; plan model design to allow soft deletion).
- Security: hashed sessions / JWT; principle of least privilege.
- Observability: structured logging (pino), basic metrics (later) & audit for role/trait changes.
- Performance: page loads < 1s for typical mentor lists (< 200 mentees). Pagination beyond.
- Availability: Single-region acceptable MVP.
- Extensibility: Data model migration-friendly via Prisma migrations.

## 10. High-Level Architecture
Monolith-first (modular boundaries internal):
- Web App (Next.js + React + App Router) – server-rendered pages + API routes.
- API Layer: tRPC (type-safe end-to-end) OR Next.js Route Handlers returning JSON; consider GraphQL later if external API needed.
- Database: PostgreSQL (hosted: Neon, Supabase, Railway, or AWS RDS). Prisma as ORM + migrations.
- Auth: Auth.js (NextAuth) or Clerk/Supabase Auth (decide tradeoffs). Simplicity: start with Auth.js + email magic link + Telegram linking.
- Background Jobs: Lightweight queue (BullMQ with Redis) OR serverless cron (Vercel cron / AWS EventBridge). MVP: daily cron computing reminder state.
- Telegram Bot: Node (TypeScript) using grammY or telegraf. Deploy as separate process (can live inside same repo) sharing DB.
- Notification Service: Abstraction for sending Telegram message (and email later).
- CLI (bun / node script) for admin batch tasks (seed roles, create unit, etc.).

Deployment (MVP):
- Option A (fastest): Vercel (web + serverless cron) + Neon/Postgres + Upstash Redis + Railway/Render for Telegram bot long polling.
- Option B (AWS-focused):
  - Web/API on AWS Amplify or ECS Fargate.
  - PostgreSQL via RDS.
  - Redis via ElastiCache.
  - EventBridge scheduled rule for daily reminders.
Pick Option A for speed; transition to AWS when scaling/security demands.

## 11. Data Model (Initial Draft)
Core Tables (Entity -> key fields):
- user (id, name, display_name, email, telegram_id, telegram_username, phone?, city, country, created_at)
- user_trait (user_id, trait, granted_by, granted_at)
- unit (id, name, city, country, created_at)
- unit_membership (user_id, unit_id, role: MEMBER|SECRETARY, active)
- mentor_link (mentor_id, mentee_id, created_at, active, last_contact_at (denormalized))
- initiation (id, user_id, acarya_id, date, nama_mantra_only boolean, notes)
- lesson_progress (user_id, lesson_number (1..6), received_at)
- practice_status (user_id, regularity enum, updated_at, notes)
- contact_log (id, mentor_id, mentee_id, channel enum, created_at, notes, needs_support boolean, follow_up_on date?)
- reminder (id, user_id, type, due_at, resolved_at)  // early minimal or derive on the fly.
- telegram_link (user_id, telegram_id, linked_at, verified boolean, otp_code, otp_expires_at)
- audit_log (id, actor_user_id, action, entity_type, entity_id, payload_json, created_at)

Indexes: ensure fast lookup by mentor_id, mentee_id, acarya_id, unit_id, telegram_id.

Derived metrics can be computed via queries or materialized views later.

## 12. Access Control (Simplified MVP)
- Trait-based gates in code (e.g., require mentor to view mentee list; require acarya to write initiation & lessons).
- Ownership checks: mentor_link relation or initiation relation.
- Admin overrides.
- Future: fine-grained policy engine (Zanzibar/Oso/Casbin) – not needed initially.

## 13. Telegram Bot (MVP Scope)
Features:
- /start → link flow (OTP displayed on web, or bot generates code to input on web).
- /me → show role(s), unit, mentor, last DC attendance placeholder, lessons received.
- /mentees → list mentees with symbols (⚠ needs contact, ✅ healthy, ⏳ pending follow-up, ❗ needs support).
- /note <mentee_ref> <text> → quick contact log.
- (Daily) proactive DM: summary of mentees needing attention.

Implementation Notes:
- Use grammY (supports middleware, TypeScript types) or telegraf.
- Long polling initial; switch to webhook behind HTTPS later.

## 14. Technology Stack Choices
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language Runtime | Bun + TypeScript | Fast dev & test; can fall back to Node where needed. |
| Web Framework | Next.js (App Router) | Hybrid SSR/ISR + API Routes; ecosystem maturity. |
| ORM | Prisma | Developer velocity, migrations, type safety. |
| Database | PostgreSQL | Relational consistency; widely supported. |
| Background Jobs | Minimal cron (Vercel / serverless) then BullMQ + Redis when needed | Start simple, scale when reminders complexity grows. |
| Auth | Auth.js (NextAuth) | Flexible providers, email magic link; can add OAuth later. |
| Telegram Bot | grammY | Modern TS typings + middleware. |
| Validation | Zod | Schema & tRPC synergy. |
| API | tRPC (internal) | End-to-end types; can expose REST facade later if needed. |
| UI | React + Tailwind CSS + Radix UI | Rapid UI + accessible components. |
| State Mgmt | TanStack Query | Server state sync + caching. |
| Logging | pino | Structured JSON; easy transport. |
| Testing | Vitest + Playwright (later) | Fast unit + optional E2E. |

## 15. Development Workflow
1. Define/adjust schema in `prisma/schema.prisma`.
2. Run migration (Prisma migrate dev) – auto-generate types.
3. Implement tRPC procedure + Zod input/output schemas.
4. Build React components/pages referencing typed endpoints.
5. Add minimal unit tests (Vitest) for service logic.
6. Pre-commit hooks (lint, type check, test) via Husky.

## 16. Roadmap / Milestones
Phase 0 – Inception (THIS DOC)
- Finalize minimal data model & stack decisions.
- Repo scaffolding, toolchain (bun, Next.js, Prisma, ESLint, Prettier, Tailwind).

Phase 1 – Core Identity & Units
- Auth (email magic link) + user profile base.
- Unit CRUD (admin) + membership assignment.
- Traits management (admin only).

Phase 2 – Mentorship Basics
- Mentor–mentee linking UI.
- Contact logs + last contact computed.
- Practice regularity field.
- Simple mentor dashboard.

Phase 3 – Initiation & Lessons
- Initiation record (acarya form).
- Lesson progression CRUD (acarya only).
- Acarya dashboard.

Phase 4 – Telegram Bot MVP
- Account linking OTP.
- Basic commands (/me, /mentees, /note, daily summary).

Phase 5 – Reminders & Attention Engine
- Daily cron computing which mentees need attention (rules configurable: days since last contact > N; irregular practice flag; missing next lesson > X months).
- Bot + web display of attention list.

Phase 6 – Unit Secretary Dashboard
- Aggregated counts & charts (basic) for unit health.
- Mentor coverage & unassigned members list.

Phase 7 – Hardening & Observability
- Audit log for role/trait changes.
- Metrics & structured logging shipping.
- Privacy review + deletion/export plan spec.

Future (Beyond MVP)
- Educational courses module.
- DC attendance tracking integration (manual or QR code check-in).
- Multi-language support.
- Rich analytics & cohort trends.
- Event sourcing or CQRS separation if complexity grows.
- Mobile app or PWA offline features.

## 17. Backlog Ideas / Icebox
- Tagging system for needs (health, family, study, etc.).
- Goal setting & progress journaling.
- Mentor load balancing suggestions.
- AI summarization of contact logs (privacy-consented).
- Email digests for weekly summary.
- Multi-factor auth (TOTP).
- Public spiritual resource library curation.

## 18. Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Data sensitivity / privacy | Minimize data fields; access controls; encrypted at rest (managed DB) & TLS in transit. |
| Scope creep | Strict MVP phases; backlog triage weekly. |
| Under-adoption by mentors | Involve early mentors in feedback loop; keep flows < 30s. |
| Telegram reliance (not all users) | Multi-channel design; email fallback. |
| Over-engineering early | Monolith-first, add services only after metrics justify. |

## 19. Open Questions
- Should seekers be allowed to select a mentor during registration or be auto-assigned by unit secretary? (Leaning: suggestion list, pending approval.)
- Minimum data for registration (email + name + city?) vs optional fields.
- Practice regularity self-reported vs mentor-reported vs both (latest authoritative?).
- Metrics retention (archive contact logs after N years?).

## 20. Getting Started (Planned Scaffold)
Planned initial folders:
```
/apps/web (Next.js)
/apps/bot (Telegram bot)
/packages/db (Prisma schema & client)
/packages/config (shared ESLint/TS)
/packages/ui (shared components)
```
Package manager: bun workspaces.

## 21. Implementation Notes & Migration Strategy
- Use Prisma migrations from day one; even if MVP simple, it prevents drift.
- Favor additive changes; avoid destructive migrations until seed data export path exists.
- Keep seed script for local dev (admin user, sample unit, test mentor/mentee).

## 22. License & Governance (Placeholder)
Decide on license (private vs open) before public release; consider internal contributors agreement.

---
This README captures the initial structured vision. Refine iteratively as discovery with first users (mentors, unit secretaries, acaryas) yields feedback.
