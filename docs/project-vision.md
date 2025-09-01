# Project Vision & Context

## 1. Vision

> Provide a unified system where seekers (pre‑initiation), new margiis, mentors, unit secretaries, and acaryas can stay connected, track progress (initiation, lessons, practices, education), and receive timely support.

### Key Outcomes

- Clear mentor & acarya visibility into support needs.
- Structured lesson & initiation history.
- Gentle reminder & contact rhythm.
- Foundation for future educational and analytics modules.
- Extendable platform for collective meditation events, retreats, and transparent finance.

## 2. Problems / Pain Points

- Fragmented tracking of initiation, lessons, meditation regularity.
- Hard to prioritize who needs contact.
- No canonical list of units, mentors, acaryas.
- Inconsistent onboarding for seekers.
- Lack of structured learning journey visibility.

## 3. Personas & Roles

| Persona            | Core Needs                                           |
| ------------------ | ---------------------------------------------------- |
| Seeker             | Onboard easily, connect with mentor, explore basics. |
| New Margii         | Guidance, progress visibility, inspiration.          |
| Established Margii | Track lessons, optionally mentor.                    |
| Mentor             | Mentee status, reminders, contact logging.           |
| Unit Secretary     | Unit metrics & mentor coverage.                      |
| Acarya             | Initiation & lesson progression oversight.           |
| Administrator      | Data integrity, roles, units.                        |

Traits: `seeker`, `initiated`, `mentor`, `unit_secretary`, `acarya`, `admin`.

## 4. Domain Glossary (Excerpt)

- Unit – Geographic/organizational cell.
- Initiation – Event granting `initiated` status.
- Lesson – One of six steps; each dated.
- Nama Mantra – Pre-init stage.
- Dharma Chakra (DC) – Collective meditation event.
- Practice Regularity – Enum of frequency.
- Contact Log – Mentor interaction note.
- Reminder – Follow-up trigger.

Full glossary details also appear in the data model file.

## 5. User Stories (Pointer)

See [User Stories](./user-stories.md) for the exhaustive, tagged list.

## 6. Non‑Goals (MVP)

- Full LMS, advanced analytics, payments, multi‑language, microservices.
  (These appear in long-term roadmap as future modules: educational content, finance ledger, retreats, announcement engine.)

## 7. Success Metrics (Initial Hypotheses)

- 80% of active mentors log at least 1 contact per mentee / 30 days.
- < 10% mentees w/ >30 days since last contact (after onboarding period).
- 90% new initiations recorded within 48h.

## 8. Open Questions

Tracked via issues labeled `question`.

## 9. Future Modules (High-Level)

- Collective Meditation (DC) Event System – standardize weekly events, tracking & announcements.
- Retreats – registration, roster management, financial summary.
- Educational – course content & progress signals.
- Finance – donations, expenses, budget visibility (lightweight ledger).
- Announcement Engine – templated multi-channel messaging (Telegram + email) inc. image generation.
