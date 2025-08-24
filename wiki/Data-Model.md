# Data Model (Detailed)

## Entities
### User
Core identity. Linked traits & memberships.

### UserTrait
Link table assigning trait strings to users.

### Unit
Organizational grouping (city, region, country).

### UnitMembership
Role within a unit (MEMBER / SECRETARY). Enables secretary dashboards.

### MentorLink
Bidirectional conceptual relation (mentor -> mentee). `active` flag enables historical churn tracking.

### Initiation
Records initiation event or nama mantra (flag) including acarya and date.

### LessonProgress
Row per lesson (1..6) with timestamp.

### PracticeStatus
Snapshot of current practice frequency & optional notes.

### ContactLog
Interaction notes, channel, flags, follow-up date.

### Reminder
Optional persisted reminder tasks (MVP may derive on query; keep table for future UX).

### TelegramLink
Association & verification state for Telegram account.

### AuditLog
Immutable record of sensitive actions.

## Enumerations (Draft)
```
PracticeRegularity = NONE | IRREGULAR | WEEKLY | DAILY | TWICE_DAILY
ContactChannel = TELEGRAM | PHONE | IN_PERSON | EMAIL | OTHER
ReminderType = CONTACT_OVERDUE | PRACTICE_CHECKIN | LESSON_FOLLOWUP
```

## Indices
- mentor_link (mentor_id, active)
- mentor_link (mentee_id, active)
- initiation (acarya_id)
- unit_membership (unit_id, role)
- telegram_link (telegram_id UNIQUE)
- contact_log (mentee_id, created_at DESC)

## Attention Rule (Example Draft)
```
NeedsAttention if
  (daysSinceLastContact > threshold) OR
  (practiceRegularity in [NONE, IRREGULAR]) OR
  (nextLessonEligible AND monthsSinceLastLesson > X)
```

## Migration Strategy
- Prisma migrations committed to VCS.
- Use seed script for dev bootstrap.
- Avoid destructive changes; use soft deletes or new columns.

---
_Last updated: placeholder._
