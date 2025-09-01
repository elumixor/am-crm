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

### DCEvent (Future)

Collective (weekly) meditation event (unit_id, starts_at, facilitator_user_id, theme, status DRAFT|SCHEDULED|COMPLETED, attendance_count cached).

### DCAttendance (Future)

User <-> DCEvent presence (user_id, dc_event_id, source MANUAL|BOT|IMPORT).

### Retreat (Future)

Structured multi-day event (title, starts_on, ends_on, capacity, status, location, cost_center_code).

### RetreatRegistration (Future)

User sign-up (retreat_id, user_id, dietary_json, accommodation_pref, payment_status, amount_paid, currency).

### Course (Future)

Educational content container (slug, title, version, status DRAFT|PUBLISHED).

### CourseLesson (Future)

Belongs to Course (course_id, order, slug, title, body_md, est_minutes).

### CourseProgress (Future)

User progress (user_id, course_lesson_id, completed_at).

### LedgerTransaction (Future)

Financial entry (id, occurred_on, amount_minor, currency, type DONATION|EXPENSE, unit_id?, retreat_id?, category, memo, source).

### AnnouncementTemplate (Future)

Template for multi-channel announcements (key, version, body_md, og_layout_spec_json, channel_mask bits).

### AnnouncementDispatch (Future)

Scheduled or executed announcement (template_version_id, context_ref (e.g. dc_event_id), scheduled_at, sent_at, channels, status, error_json).

## Enumerations (Draft)

```
PracticeRegularity = NONE | IRREGULAR | WEEKLY | DAILY | TWICE_DAILY
ContactChannel = TELEGRAM | PHONE | IN_PERSON | EMAIL | OTHER
ReminderType = CONTACT_OVERDUE | PRACTICE_CHECKIN | LESSON_FOLLOWUP
DCEventStatus = DRAFT | SCHEDULED | COMPLETED | CANCELED
RetreatStatus = DRAFT | REG_OPEN | REG_CLOSED | COMPLETED | CANCELED
PaymentStatus = PENDING | PARTIAL | PAID | REFUNDED
AnnouncementChannel = TELEGRAM | EMAIL | WEB
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
