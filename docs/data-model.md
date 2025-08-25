# Data Model (Detailed)

## Entities

### User

Identity; links to traits, unit memberships, mentor links, initiation, lessons, practice status.

### UserTrait

Assigns a trait string to a user (role system).

### Unit

Organizational grouping (city / region / country).

### UnitMembership

Relates user to unit with role MEMBER | SECRETARY.

### MentorLink

Relation mentor -> mentee with `active` flag and `last_contact_at` denorm field.

### Initiation

Records initiation or nama mantra event (with acarya id, date).

### LessonProgress

Row per lesson (1..6) with received timestamp.

### PracticeStatus

Current practice regularity + notes.

### ContactLog

Channel, notes, flags, follow-up date.

### Reminder

Persisted reminder items (optional; may derive in MVP).

### TelegramLink

Associates verified Telegram account.

### AuditLog

Immutable record of sensitive actions.

## Enumerations (Draft)

```
PracticeRegularity = NONE | IRREGULAR | WEEKLY | DAILY | TWICE_DAILY
ContactChannel = TELEGRAM | PHONE | IN_PERSON | EMAIL | OTHER
ReminderType = CONTACT_OVERDUE | PRACTICE_CHECKIN | LESSON_FOLLOWUP
```

## Indices (Examples)

- mentor_link (mentor_id, active)
- mentor_link (mentee_id, active)
- initiation (acarya_id)
- unit_membership (unit_id, role)
- telegram_link (telegram_id UNIQUE)
- contact_log (mentee_id, created_at DESC)

## Attention Rule (Draft)

```
NeedsAttention if
  (daysSinceLastContact > threshold) OR
  (practiceRegularity in [NONE, IRREGULAR]) OR
  (nextLessonEligible AND monthsSinceLastLesson > X)
```

## Migration Strategy

- Commit Prisma migrations.
- Use seeds for dev bootstrap.
- Prefer additive changes; soft delete for removals.

---

_Last updated: placeholder._
